package org.main.claimstreams.controllers;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.models.enums.UserRole;
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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final InsuranceClaimRepository claimRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, String>> registerUser(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String fullName,
            @RequestParam UserRole role
    ) {
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        String encodedPassword = passwordEncoder.encode(password);

        User newUser = new User(email, encodedPassword, fullName, role);
        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", "SUCCESS",
                "message", "User created with role: " + role.name()
        ));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestParam String email,
            @RequestParam String password
    ) {
        var userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Invalid credentials"
            ));
        }

        User user = userOpt.get();
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole(), user.getPolicyNumber());

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "token", token,
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "fullName", user.getFullName()

        ));
    }

    @GetMapping("/claims/my-claims")
    public ResponseEntity<List<InsuranceClaim>> getCustomerClaims(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<InsuranceClaim> myClaims = claimRepository.findAll().stream()
                .filter(c -> c.getPolicyNumber().equalsIgnoreCase(user.getPolicyNumber()))
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(myClaims);
    }

    @GetMapping("/adjuster/queue")
    public ResponseEntity<List<InsuranceClaim>> getAdjusterQueue() {
        List<InsuranceClaim> queue = claimRepository.findByStatus(InsuranceClaimStatus.MANUAL_REVIEW);
        return ResponseEntity.status(HttpStatus.OK).body(queue);
    }

    @PostMapping("/senior-adjuster/override")
    public ResponseEntity<Map<String, String>> overrideHighRiskClaim(
            @RequestParam String claimReference,
            @RequestParam String decision,
            Authentication authentication
    ) {
        var claimOpt = claimRepository.findByClaimReference(claimReference);

        if (claimOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "Claim reference not found"
            ));
        }

        InsuranceClaim claim = claimOpt.get();

//        Logic to be changed later
        claim.setStatus(InsuranceClaimStatus.MANUAL_REVIEW.name().equalsIgnoreCase(decision) ? InsuranceClaimStatus.APPROVED : InsuranceClaimStatus.REJECTED);
        claimRepository.save(claim);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "status", "SUCCESS",
                "claimReference", claimReference,
                "updatedStatus", claim.getStatus().toString(),
                "overriddenBy", authentication.getName()
        ));
    }


}
