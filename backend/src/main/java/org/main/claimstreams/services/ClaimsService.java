package org.main.claimstreams.services;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.ClaimMetricDto;
import org.main.claimstreams.dtos.CreateClaimRequestDto;
import org.main.claimstreams.dtos.UpdateClaimStatusDto;
import org.main.claimstreams.exception.InvalidActionException;
import org.main.claimstreams.exception.ResourceNotFoundException;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.User;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClaimsService {

    private final InsuranceClaimRepository claimRepository;
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;

    public Page<InsuranceClaim> getAllClaims(String status, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());

        if (status != null && !status.equalsIgnoreCase("ALL")) {
            InsuranceClaimStatus claimStatus = InsuranceClaimStatus.valueOf(status);
            return claimRepository.findByStatus(claimStatus, pageable);
        }
        return claimRepository.findAll(pageable);
    }

    @Transactional
    public ResponseEntity<Map<String, String>> updateClaim(UpdateClaimStatusDto claimStatus) {
        InsuranceClaim claim = claimRepository.findByClaimId(claimStatus.claimId()).orElseThrow();

        InsuranceClaimStatus status = InsuranceClaimStatus.valueOf(claimStatus.status().toUpperCase());

        claim.setStatus(status);

        return ResponseEntity.ok().body(Map.of(
                "status", "SUCCESS",
                "message", "status for claim " + claimStatus.claimId() + " updated."
        ));
    }

    public InsuranceClaim submitClaim(Authentication authentication, CreateClaimRequestDto request) {
        Policy policy = policyRepository.findByPolicyNumber(request.policyNumber()).orElseThrow(
                () -> new ResourceNotFoundException("Policy not found")
        );

        if (new BigDecimal(request.claimedAmount()).compareTo(policy.getMaxCoverageLimit()) > 0) {
            throw new InvalidActionException("Claimed amount cannot be greater than Coverage limit");
        }

        InsuranceClaim claim = new InsuranceClaim(policy, request.perilType(), new BigDecimal(request.claimedAmount()));

        claimRepository.save(claim);

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        user.addClaim(claim);

        userRepository.save(user);

        return claim;
    }

    @Transactional(readOnly = true)
    public ClaimMetricDto getClaimsData() {
        long totalClaims = claimRepository.count();
        long approvedClaims = claimRepository.countByStatus(InsuranceClaimStatus.AUTO_APPROVED);
        long pendingClaims = claimRepository.countByStatus(InsuranceClaimStatus.MANUAL_REVIEW);

        return new ClaimMetricDto(totalClaims, approvedClaims, pendingClaims);
    }
}
