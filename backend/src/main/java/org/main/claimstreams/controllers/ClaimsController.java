package org.main.claimstreams.controllers;

import lombok.AllArgsConstructor;
import org.main.claimstreams.dtos.CreateClaimRequestDto;
import org.main.claimstreams.dtos.CreateClaimResponseDto;
import org.main.claimstreams.dtos.UpdateClaimStatusDto;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.User;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.repositories.UserRepository;
import org.main.claimstreams.services.CatastropheIngestionService;
import org.main.claimstreams.services.ClaimsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/claims")
@AllArgsConstructor
public class ClaimsController {
    private final InsuranceClaimRepository claimRepository;
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;
    private final CatastropheIngestionService loadSimulator;
    private final ClaimsService claimsService;

    @PostMapping("/create")
    public ResponseEntity<?> submitClaim(
            @RequestBody CreateClaimRequestDto request,
            Authentication authentication
    ) {

        Optional<Policy> policyOpt = policyRepository.findByPolicyNumber(request.policyNumber());

        if (policyOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "Policy not found"
                    ));
        }

        Policy policy = policyOpt.get();

        InsuranceClaim claim = new InsuranceClaim(policy, request.perilType(), new BigDecimal(request.claimedAmount()));

        claimRepository.save(claim);

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        user.addClaim(claim);

        userRepository.save(user);

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

    @GetMapping("/get-all-claims")
    public ResponseEntity<List<InsuranceClaim>> getAllClaims() {
        List<InsuranceClaim> claims = claimsService.getAllClaims();
        return ResponseEntity.status(HttpStatus.OK).body(claims);
    }

    @PutMapping("/update-status")
    public ResponseEntity<Map<String, String>> updateStatus(@RequestBody UpdateClaimStatusDto req) {
        return claimsService.updateClaim(req);
    }
}
