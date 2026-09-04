package org.main.claimstreams.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.PolicyRequestDto;
import org.main.claimstreams.dtos.PolicyResponseDto;
import org.main.claimstreams.dtos.RegisterRequestDto;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.User;
import org.main.claimstreams.models.enums.Perils;
import org.main.claimstreams.models.enums.UserRole;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final AuthService authService;

    @Value(("${DEFAULT_PASSWORD}"))
    private String defaultPassword;

    @Transactional
    public ResponseEntity<PolicyResponseDto> createPolicy(PolicyRequestDto request) {

        Optional<User> userOpt = userRepository.findByEmail(request.policyHolderEmail());

        User user;

        if (userOpt.isEmpty()) {
            RegisterRequestDto registerRequestDto = new RegisterRequestDto(
                    request.policyHolderEmail(),
                    defaultPassword,
                    request.policyHolderName(),
                    UserRole.ROLE_CUSTOMER
            );

            authService.register(registerRequestDto);

            user = userRepository.findByEmail(request.policyHolderEmail()).orElseThrow();
        } else {
            user = userOpt.get();
        }

        BigDecimal deductible = new BigDecimal(request.deductible());
        BigDecimal maxCoverageLimit = new BigDecimal(request.maxCoverageLimit());

        if (deductible.compareTo(maxCoverageLimit) > 0) {
            throw new IllegalArgumentException("Deductible cannot be greater than maximum coverage limit");
        }

        Set<Perils> coveredPerils = request.coveredPeril().stream()
                .map(perilString -> Perils.valueOf(perilString.toUpperCase()))
                .collect(Collectors.toSet());


        Policy policy = new Policy(
                coveredPerils,
                maxCoverageLimit,
                deductible
        );

        policy.setUser(user);

        Policy savedPolicy = policyRepository.save(policy);

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
