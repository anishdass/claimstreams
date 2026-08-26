package org.main.claimstreams.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.UpdateClaimStatusDto;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClaimsService {

    private final InsuranceClaimRepository claimRepository;

    public List<InsuranceClaim> getAllClaims() {
        return claimRepository.findAll(PageRequest.of(0, 10)).getContent();
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
}
