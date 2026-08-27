package org.main.claimstreams.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.models.enums.PolicyStatus;
import org.main.claimstreams.repositories.ClaimAuditLogRepository;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.main.claimstreams.models.ClaimAuditLog;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.InsuranceClaim;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ClaimAdjudicationEngine {
    private final InsuranceClaimRepository claimRepository;
    private final PolicyRepository policyRepository;
    private final ClaimAuditLogRepository auditLogRepository;
    private final StringRedisTemplate redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Transactional
    @KafkaListener(topics = "claims-submitted", groupId = "claimstream-adjudication-group")
    public void adjudicateClaim(String claimJson) {
        try {
            InsuranceClaim claim = objectMapper.readValue(claimJson, InsuranceClaim.class);
            InsuranceClaimStatus previousStatus = claim.getStatus();
            String rejectionReason;

            Optional<Policy> policyOpt = policyRepository.findByPolicyNumber(claim.getPolicy().getPolicyNumber());

            if (policyOpt.isEmpty() || !policyOpt.get().getStatus().name().equalsIgnoreCase(PolicyStatus.ACTIVE.name())) {
                rejectionReason = "Policy inactive or non-existent";
                rejectClaim(claim, previousStatus, rejectionReason);
                claim.setReason(rejectionReason);
                return;
            }

            Policy policy = policyOpt.get();

            if (!policy.getCoveredPeril().contains(claim.getPerilType())) {
                rejectionReason = "Peril " + claim.getPerilType() + " not covered under policy";
                rejectClaim(claim, previousStatus, rejectionReason);
                claim.setReason(rejectionReason);
            }

            if (claim.getClaimedAmount().compareTo(policy.getMaxCoverageLimit()) > 0) {
                rejectionReason = "Claim amount exceeds maximum policy limit";
                rejectClaim(claim, previousStatus, rejectionReason);
                claim.setReason(rejectionReason);
                return;
            }

            int calculatedRiskScore = evaluateRiskScore(claim, policy);
            claim.setRiskScore(calculatedRiskScore);

            if (calculatedRiskScore < 15) {
                BigDecimal netPayout = claim.getClaimedAmount().subtract(policy.getDeductible());
                claim.setApprovedPayoutAmount(netPayout.max(BigDecimal.ZERO));
                claim.setStatus(InsuranceClaimStatus.AUTO_APPROVED);

                claimRepository.save(claim);
                auditLogRepository.save(new ClaimAuditLog(
                        claim.getClaimId(),
                        previousStatus,
                        claim.getStatus(),
                        "Low risk score (" + calculatedRiskScore + "). Payout: £" + netPayout
                ));

                kafkaTemplate.send("claims-payouts", claim.getClaimId(), objectMapper.writeValueAsString(claim));
                System.out.println("[AUTO APPROVED] Claim " + claim.getClaimId() + " Net Payout: £" + netPayout);
            } else {
                claim.setStatus(InsuranceClaimStatus.MANUAL_REVIEW);
                claimRepository.save(claim);

                rejectionReason = "High risk score (" + calculatedRiskScore + "). Escalated to adjuster queue.";

                auditLogRepository.save(new ClaimAuditLog(
                        claim.getClaimId(),
                        previousStatus,
                        claim.getStatus(),
                        "High risk score (" + calculatedRiskScore + "). Escalated to adjuster queue."
                ));

                claim.setReason(rejectionReason);

                String slaKey = "claim:sla:timer" + claim.getClaimId();
                redisTemplate.opsForValue().set(slaKey, claim.getStatus().toString(), Duration.ofDays(7));

                System.out.println("[FLAGGED FOR REVIEW] Claim " + claim.getClaimId() + " Risk Score: " + calculatedRiskScore);
            }

        } catch (Exception e) {
            System.err.println("Error processing claim adjudication: " + e.getMessage());
        }

    }

    private int evaluateRiskScore(InsuranceClaim claim, Policy policy) {
        int score = 0;

        String velocityKey = "claims:velocity:" + claim.getPolicy().getPolicyNumber();
        Long recentClaimsCount = redisTemplate.opsForValue().increment(velocityKey);

        if (recentClaimsCount != null && recentClaimsCount == 1) {
            redisTemplate.expire(velocityKey, Duration.ofHours(24));
        }

        if (recentClaimsCount != null && recentClaimsCount > 2) {
            score += 40;
        }

        BigDecimal percentageOfLimit = claim.getClaimedAmount()
                .divide(policy.getMaxCoverageLimit(), 2, RoundingMode.HALF_UP);

        if (percentageOfLimit.compareTo(new BigDecimal(".90")) > 0) {
            score += 25;
        }

        if (claim.getClaimedAmount().remainder(new BigDecimal("1000")).compareTo(BigDecimal.ZERO) == 0) {
            score += 15;
        }

        return Math.min(100, score);
    }

    private void rejectClaim(InsuranceClaim claim, InsuranceClaimStatus previousStatus, String reason) {
        claim.setStatus(InsuranceClaimStatus.REJECTED);
        claimRepository.save(claim);
        auditLogRepository.save(new ClaimAuditLog(
                claim.getClaimId(),
                previousStatus,
                claim.getStatus(),
                reason
        ));
    }
}
