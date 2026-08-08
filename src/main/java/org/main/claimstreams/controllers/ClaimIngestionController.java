package org.main.claimstreams.controllers;

import lombok.AllArgsConstructor;
import org.main.claimstreams.models.enums.Peril;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.services.CatastropheIngestionService;
import org.main.claimstreams.services.ClaimProducer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/claims")
@AllArgsConstructor
public class ClaimIngestionController {
    private final ClaimProducer claimProducer;
    private final CatastropheIngestionService loadSimulator;

    @PostMapping
    public ResponseEntity<Map<String, String>> submitClaim(
            @RequestParam String policyNumber,
            @RequestParam Peril perilType,
            @RequestParam BigDecimal claimedAmount
    ) {
        String claimReference = "CLM-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        InsuranceClaim claim = new InsuranceClaim(claimReference, policyNumber, perilType, claimedAmount);

        claimProducer.publishClaimSubmittedEvent(claim);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                "status", "ACCEPTED",
                "claimReference", claimReference,
                "message", "Claim queued into Kafka pipeline for real-time adjudication."
        ));
    }

    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> submitBatchClaims(@RequestBody List<InsuranceClaim> claims) {
        int queuedCount = 0;
        for (InsuranceClaim claim : claims) {
            claimProducer.publishClaimSubmittedEvent(claim);
            queuedCount++;
        }

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "totalBatchIngested", queuedCount,
                "message", "Bulk claims queued in Kafka pipeline"
        ));
    }

    @PostMapping("/simulate-peril")
    public ResponseEntity<Map<String, Object>> triggerCatastropheStorm(
            @RequestParam(defaultValue = "1000") int claimCount
    ) {
        int processedCount = loadSimulator.simulateCatastropheStorm(claimCount);

        return ResponseEntity.ok(Map.of(
                "status", "STORM_EXECUTED",
                "concurrentClaimsFired", processedCount,
                "message", "Catastrophe storm wave streamed through Kafka pipeline successfully,"
        ));
    }
}
