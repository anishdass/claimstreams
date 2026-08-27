package org.main.claimstreams.services;

import jakarta.transaction.Transactional;
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

    @Transactional
    public ResponseEntity<PolicyResponseDto> createPolicy(PolicyRequestDto request) {

        String sanitizedEmail = request.policyHolderEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(request.policyHolderEmail()).orElseGet(() -> userRepository.save(new User(
                sanitizedEmail,
                "12345678", //Default password
                request.policyHolderName(),
                UserRole.ROLE_CUSTOMER
        )));

        BigDecimal deductible = new BigDecimal(request.deductible());
        BigDecimal maxCoverageLimit = new BigDecimal(request.maxCoverageLimit());

        if (deductible.compareTo(maxCoverageLimit) > 0) {
            throw new IllegalArgumentException("Deductible cannot be greater than maximum coverage limit");
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

        Policy savedPolicy=policyRepository.save(policy);

        PolicyResponseDto response = new PolicyResponseDto(
                "SUCCESS",
                "Policy " + savedPolicy.getPolicyNumber() + " created for user " + user.getFullName(),
                savedPolicy.getPolicyNumber()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    public ResponseEntity<List<Perils>> getUpdatedPerils() {
        return ResponseEntity.ok().body(List.of(Perils.values()));
    }
}
