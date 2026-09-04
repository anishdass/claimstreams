package org.main.claimstreams.controllers;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.*;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.main.claimstreams.repositories.UserRepository;
import org.main.claimstreams.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {
    private final InsuranceClaimRepository claimRepository;
    private final AuthService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody RegisterRequestDto request) {
        return authService.register(request);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        return authService.login(request);
    }

    @GetMapping("/claims/my-claims")
    public ResponseEntity<List<InsuranceClaim>> getCustomerClaims(Authentication authentication) {
        List<InsuranceClaim> myClaims = authService.getMyClaims(authentication);
        return ResponseEntity.status(HttpStatus.OK).body(myClaims);
    }

    @GetMapping("/adjuster/queue")
    public ResponseEntity<List<InsuranceClaim>> getAdjusterQueue() {
        List<InsuranceClaimStatus> statuses = new ArrayList<>();
        statuses.add(InsuranceClaimStatus.MANUAL_REVIEW);
        statuses.add(InsuranceClaimStatus.SUBMITTED);
        List<InsuranceClaim> queue = claimRepository.findByStatusIn(statuses);
        return ResponseEntity.status(HttpStatus.OK).body(queue);
    }

    @PostMapping("/senior-adjuster/override")
    public ResponseEntity<?> overrideHighRiskClaim(
            @RequestBody UpdateStatusRequestDto request,
            Authentication authentication
    ) {
        var claimOpt = claimRepository.findByClaimId(request.claimId());

        if (claimOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "Claim not found"
            ));
        }

        InsuranceClaim claim = claimOpt.get();

        claim.setStatus(request.decision().equalsIgnoreCase(InsuranceClaimStatus.APPROVED.toString()) ? InsuranceClaimStatus.APPROVED : InsuranceClaimStatus.REJECTED);

        claimRepository.save(claim);

        UpdateStatusResponseDto response = new UpdateStatusResponseDto(
                "SUCCESS",
                request.claimId(),
                claim.getStatus().toString(),
                authentication.getName()
        );

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/auth/change-password")
    public ResponseEntity<Map<String, String>> changePassword(Authentication auth, @RequestBody ChangePasswordRequestDto dto) {
        return authService.changePassword(auth, dto);
    }
}
