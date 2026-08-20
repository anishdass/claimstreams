package org.main.claimstreams.configs;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.repositories.ClaimAuditLogRepository;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.main.claimstreams.models.ClaimAuditLog;
import org.main.claimstreams.models.InsuranceClaim;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@AllArgsConstructor
public class RedisSlaExpiryListener implements MessageListener {
    private final InsuranceClaimRepository claimRepository;
    private final ClaimAuditLogRepository auditLogRepository;


    @Override
    @Transactional
    public void onMessage(Message message, byte @Nullable [] pattern) {
        String expiredKey = message.toString();

        if (expiredKey.startsWith("claim:sla:timer")) {
            String claimReference = expiredKey.replace("claim:sla:timer", "");
            System.err.println("[SLA BREACH DETECTED] Timer expired for claim: " + claimReference);

            Optional<InsuranceClaim> claimOptional = claimRepository.findByClaimReference(claimReference);

            if (claimOptional.isPresent()) {
                InsuranceClaim claim = claimOptional.get();

                if (claim.getStatus().toString().equalsIgnoreCase("MANUAL_REVIEW")) {
                    InsuranceClaimStatus previousStatus = claim.getStatus();
                    claim.setStatus(InsuranceClaimStatus.SLA_BREACH_ESCALATED);
                    claimRepository.save(claim);

                    auditLogRepository.save(new ClaimAuditLog(
                            claim.getClaimId(),
                            previousStatus,
                            claim.getStatus(),
                            "Statutory 7 day manual review SLA expired without adjuster resolution"
                    ));

                    System.out.println("[Escalated] Claim " + claimReference + " escalated to senior review queue due to SLA breach.");

                }
            }
        }
    }
}
