package org.main.claimstreams.services;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.PolicyRequestDto;
import org.main.claimstreams.dtos.PolicyResponseDto;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.enums.Perils;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.repositories.PolicyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class CatastropheIngestionService {
    private final ClaimProducer claimProducer;
    private final PolicyService policyService;
    private final PolicyRepository policyRepository;
    private final Random random = new Random();
    private final String[] perils = {"FLOOD", "STORM", "FIRE", "ESCAPE_OF_WATER"};

    public int simulatePeril(int totalClaims) {
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        CountDownLatch starterLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(totalClaims);
        AtomicInteger successfulIngestion = new AtomicInteger(0);

        for (int i = 0; i < totalClaims; i++) {
            executor.submit(() -> {
                try {
                    starterLatch.await();

                    String selectedPeril = perils[random.nextInt(perils.length)];
                    List<String> perilList = List.of(selectedPeril);

                    double randomCoverage = 10000 + (random.nextInt(9) + 1) * 10000;
                    int deductiblePercentage = random.nextInt(2, 5);
                    double deductible = (deductiblePercentage * randomCoverage) / 100.0;

                    PolicyRequestDto policyDto = new PolicyRequestDto(
                            "anishdassatoffice@gmail.com",
                            "Anish Dass",
                            perilList,
                            String.valueOf(randomCoverage),
                            String.valueOf(deductible)
                    );

                    ResponseEntity<PolicyResponseDto> response = policyService.createPolicy(policyDto);

                    if (response.getBody() == null) {
                        throw new IllegalStateException("Failed to create policy: Response body is null");
                    }

                    String policyNumber = response.getBody().policyID();

                    Policy policy = policyRepository.findByPolicyNumber(policyNumber)
                            .orElseThrow(() -> new IllegalStateException("Policy not found in DB: " + policyNumber));

                    boolean injectHighRisk = random.nextDouble() < 0.40;
                    BigDecimal claimedAmount;

                    if (injectHighRisk) {
                        if (random.nextBoolean()) {
                            long roundMultiplier = random.nextInt(1, (int) (randomCoverage / 1000));
                            claimedAmount = BigDecimal.valueOf(roundMultiplier * 1000).setScale(2, RoundingMode.HALF_UP);
                        } else {
                            double highVal = randomCoverage * (0.95 + (random.nextDouble() * 0.04));
                            claimedAmount = BigDecimal.valueOf(highVal).setScale(2, RoundingMode.HALF_UP);
                        }
                    } else {
                        double minClaim = 500.0;
                        double maxLowRiskClaim = randomCoverage * 0.70; // Cap at 70% of max limit
                        double randomClaimVal = minClaim + (random.nextDouble() * (maxLowRiskClaim - minClaim));
                        claimedAmount = BigDecimal.valueOf(randomClaimVal).setScale(2, RoundingMode.HALF_UP);
                    }

                    Perils peril = Perils.valueOf(selectedPeril.toUpperCase());

                    InsuranceClaim claim = new InsuranceClaim(policy, peril, claimedAmount);
                    claim.setUser(policy.getUser());
                    claimProducer.publishClaimSubmittedEvent(claim);

                    successfulIngestion.incrementAndGet();

                } catch (Exception e) {
                    System.err.println("Ingestion error: " + e.getMessage());
                } finally {
                    finishLatch.countDown();
                }
            });
        }
        starterLatch.countDown();
        try {
            finishLatch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            executor.shutdown();
        }
        return successfulIngestion.get();
    }
}