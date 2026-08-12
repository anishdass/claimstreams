package org.main.claimstreams.controllers;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.User;
import org.main.claimstreams.models.enums.Peril;
import org.main.claimstreams.models.enums.UserRole;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/policy")
@RequiredArgsConstructor
public class PolicyProducer {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createPolicy(
            @RequestParam String policyHolderName,
            @RequestParam String policyHolderEmail,
            @RequestParam Set<Peril> coveredPeril,
            @RequestParam BigDecimal maxCoverageLimit,
            @RequestParam BigDecimal deductible
    ) {
        Optional<User> userOpt = userRepository.findByEmail(policyHolderEmail);

        User user = userOpt.orElseGet(() -> new User(
                policyHolderEmail,
                "12345678", //Default password
                policyHolderName,
                UserRole.ROLE_CUSTOMER
        ));

        Policy policy = new Policy(
                policyHolderName,
                policyHolderEmail,
                coveredPeril,
                maxCoverageLimit,
                deductible
        );
        policyRepository.save(policy);

        user.setPolicyNumber(policy.getPolicyNumber());

        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of(
                        "status", "SUCCESS",
                        "message", "Policy created"
                ));
    }
}
