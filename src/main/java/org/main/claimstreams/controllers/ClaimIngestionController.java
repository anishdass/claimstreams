package org.main.claimstreams.controllers;

import lombok.AllArgsConstructor;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.enums.Peril;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.services.CatastropheIngestionService;
import org.main.claimstreams.services.ClaimProducer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/claims")
@AllArgsConstructor
public class ClaimIngestionController {
    private final ClaimProducer claimProducer;
    private final PolicyRepository policyRepository;
    private final CatastropheIngestionService loadSimulator;

    @PostMapping
    public ResponseEntity<Map<String, String>> submitClaim(
            @RequestParam String policyNumber,
            @RequestParam Peril perilType,
            @RequestParam BigDecimal claimedAmount
    ) {

        Optional<Policy> policyOpt = policyRepository.findByPolicyNumber(policyNumber);
        Policy policy;
        if (policyOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "Policy not found"
                    ));
        } else {
            policy = policyOpt.get();
        }

        InsuranceClaim claim = new InsuranceClaim(policy.getPolicyNumber(), perilType, claimedAmount);

        claimProducer.publishClaimSubmittedEvent(claim);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                "status", "ACCEPTED",
                "claimReference", claim.getClaimReference(),
                "message", "Claim queued into Kafka pipeline for real-time adjudication."
        ));
    }

    @PostMapping("/simulate-peril")
    public ResponseEntity<Map<String, Object>> triggerCatastropheStorm(
            @RequestParam(defaultValue = "1000") int claimCount
    ) {
        int processedCount = loadSimulator.simulatePeril(claimCount);

        return ResponseEntity.ok(Map.of(
                "status", "TEST PERIL EXECUTED",
                "concurrentClaimsFired", processedCount,
                "message", "Catastrophe storm wave streamed through Kafka pipeline successfully,"
        ));
    }
}
