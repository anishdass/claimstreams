package org.main.claimstreams.controllers;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.*;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.models.User;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.main.claimstreams.repositories.UserRepository;
import org.main.claimstreams.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final InsuranceClaimRepository claimRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, String>> registerUser(
            @RequestBody RegisterRequestDto request
    ) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email already registered"));
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        User newUser = new User(request.email(), encodedPassword, request.fullName(), request.role());
        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "User " + newUser.getFullName() + " created with role: " + newUser.getRole().name()
        ));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequestDto request
    ) {
        var userOpt = userRepository.findByEmail(request.email());

        if (userOpt.isEmpty() || !passwordEncoder.matches(request.password(), userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Invalid credentials"
            ));
        }

        User user = userOpt.get();
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());

        UserResponseDto userResponseDto = new UserResponseDto(
                user.getRole(),
                user.getEmail(),
                user.getFullName(),
                user.getPolicies(),
                user.getClaims()
        );

        AuthResponseDto response = new AuthResponseDto(
                token,
                userResponseDto);


        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/claims/my-claims")
    public ResponseEntity<List<InsuranceClaim>> getCustomerClaims(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<InsuranceClaim> myClaims = claimRepository.findByUser(user).orElseThrow();

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


}
