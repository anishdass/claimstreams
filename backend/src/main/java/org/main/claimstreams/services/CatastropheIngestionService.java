package org.main.claimstreams.services;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.enums.Perils;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.repositories.PolicyRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class CatastropheIngestionService {
    private final ClaimProducer claimProducer;
    private final PolicyRepository policyRepository;
    private final Random random = new Random();
    private final Perils[] perils = {Perils.FLOOD, Perils.STORM, Perils.FIRE, Perils.ESCAPE_OF_WATER};

    public int simulatePeril(int totalClaims) {
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        CountDownLatch starterLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(totalClaims);
        AtomicInteger successfulIngestion = new AtomicInteger(0);

        for (int i = 0; i < totalClaims; i++) {
            executor.submit(() -> {
                try {
                    starterLatch.await();

                    Set<Perils> peril = new HashSet<>();
                    peril.add(perils[random.nextInt(perils.length)]);

                    double randomCoverage = 10000 + (random.nextInt(10) * 10000);
                    int deductiblePercentage = random.nextInt(2, 5);
                    double deductible = deductiblePercentage * randomCoverage / 100;


                    Policy policy = new Policy(
                            "Anish",
                            "anishdassatoffice@gmail.com",
                            peril,
                            BigDecimal.valueOf(randomCoverage),
                            BigDecimal.valueOf(deductible)
                    );

                    policyRepository.save(policy);

                    System.out.println("[POLICY CREATED]: " + policy.getPolicyNumber());

                    BigDecimal claimedAmount = BigDecimal.valueOf(random.nextDouble() * randomCoverage).setScale(2, RoundingMode.HALF_UP);

                    InsuranceClaim claim = new InsuranceClaim(policy, peril.stream().findFirst().orElse(null), claimedAmount);
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
