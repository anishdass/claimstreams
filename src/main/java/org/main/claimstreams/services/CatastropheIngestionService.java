package org.main.claimstreams.services;

import org.main.claimstreams.models.InsuranceClaim;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

@Service

public class CatastropheIngestionService {
    private final ClaimProducer claimProducer;
    private final Random random = new Random();
    private final String[] perils = {"FLOOD", "WINDSTORM", "FIRE", "THEFT"};

    public CatastropheIngestionService(ClaimProducer claimProducer) {
        this.claimProducer = claimProducer;
    }

    public int simulateCatastropheStorm(int totalClaims) {
        ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
        CountDownLatch starterLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(totalClaims);
        AtomicInteger successfulIngestions = new AtomicInteger(0);

        for (int i = 0; i < totalClaims; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    starterLatch.await();

                    String claimRef = "STORM-2026-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                    String policyNum = "POL-UK-" + (1000 + (index % 50));
                    String peril = perils[random.nextInt(perils.length)];
                    BigDecimal amount = BigDecimal.valueOf(500 + random.nextInt(9500));

                    InsuranceClaim claim = new InsuranceClaim(claimRef, policyNum, peril, amount);
                    claimProducer.publishClaimSubmittedEvent(claim);
                    successfulIngestions.incrementAndGet();
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
        return successfulIngestions.get();
    }
}
