package org.main.claimstreams.controllers;

import lombok.AllArgsConstructor;
import org.main.claimstreams.dtos.ClaimMetricDto;
import org.main.claimstreams.dtos.CreateClaimRequestDto;
import org.main.claimstreams.dtos.CreateClaimResponseDto;
import org.main.claimstreams.dtos.UpdateClaimStatusDto;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.repositories.UserRepository;
import org.main.claimstreams.services.CatastropheIngestionService;
import org.main.claimstreams.services.ClaimsService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/claims")
@AllArgsConstructor
public class ClaimsController {
    private final CatastropheIngestionService loadSimulator;
    private final ClaimsService claimsService;

    @PostMapping("/create")
    public ResponseEntity<?> submitClaim(
            @RequestBody CreateClaimRequestDto request,
            Authentication authentication
    ) {
        InsuranceClaim claim = claimsService.submitClaim(authentication, request);
        CreateClaimResponseDto response = new CreateClaimResponseDto(
                "ACCEPTED",
                claim.getClaimId(),
                "Claim created"
        );
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @PostMapping("/simulate-peril")
    public ResponseEntity<Map<String, Object>> triggerCatastropheStorm(
            @RequestParam int claimCount
    ) {
        int processedCount = loadSimulator.simulatePeril(claimCount);

        return ResponseEntity.ok(Map.of(
                "status", "TEST PERIL EXECUTED",
                "concurrentClaimsFired", processedCount,
                "message", "Catastrophe storm wave streamed through Kafka pipeline successfully,"
        ));
    }

    @GetMapping("/get-paginated-claims")
    public ResponseEntity<Page<InsuranceClaim>> getAllClaims(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {
        Page<InsuranceClaim> claims = claimsService.getAllClaims(status, pageNumber, pageSize);
        return ResponseEntity.status(HttpStatus.OK).body(claims);
    }

    @GetMapping("/get-claims-metrics")
    public ResponseEntity<ClaimMetricDto> getClaimDetails() {
        ClaimMetricDto claimMetricData = claimsService.getClaimsData();
        return ResponseEntity.status(HttpStatus.OK).body(claimMetricData);
    }


    @PutMapping("/update-status")
    public ResponseEntity<Map<String, String>> updateStatus(@RequestBody UpdateClaimStatusDto req) {
        return claimsService.updateClaim(req);
    }
}
