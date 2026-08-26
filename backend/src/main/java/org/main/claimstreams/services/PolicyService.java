package org.main.claimstreams.services;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.PolicyRequestDto;
import org.main.claimstreams.dtos.PolicyResponseDto;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.User;
import org.main.claimstreams.models.enums.Perils;
import org.main.claimstreams.models.enums.UserRole;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;

    public ResponseEntity<?> createPolicy(PolicyRequestDto request) {
        User user = userRepository.findByEmail(request.policyHolderEmail()).orElseGet(() -> new User(
                request.policyHolderEmail(),
                "12345678", //Default password
                request.policyHolderName(),
                UserRole.ROLE_CUSTOMER
        ));

        BigDecimal deductible = new BigDecimal(request.deductible());
        BigDecimal maxCoverageLimit = new BigDecimal(request.maxCoverageLimit());

        if (deductible.compareTo(maxCoverageLimit) > 1) {
            ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILED",
                    "message", "Deductible is greater than max coverage"
            ));
        }

        Set<Perils> coveredPerils = request.coveredPeril().stream()
                .map(perilString -> Perils.valueOf(perilString.toUpperCase()))
                .collect(Collectors.toSet());


        Policy policy = new Policy(
                user.getFullName(),
                user.getEmail(),
                coveredPerils,
                maxCoverageLimit,
                deductible
        );

        policy.setUser(user);

        policyRepository.save(policy);

        user.addPolicy(policy);

        userRepository.save(user);

        PolicyResponseDto response = new PolicyResponseDto(
                "SUCCESS",
                "Policy " + policy.getPolicyNumber() + " created for user " + user.getFullName()
        );

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    public ResponseEntity<List<Perils>> getUpdatedPerils() {
        return ResponseEntity.ok().body(List.of(Perils.values()));
    }
}
