package org.main.claimstreams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.main.claimstreams.models.enums.Perils;
import org.main.claimstreams.repositories.ClaimAuditLogRepository;
import org.main.claimstreams.repositories.PolicyRepository;
import org.main.claimstreams.repositories.InsuranceClaimRepository;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.services.ClaimProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.kafka.KafkaContainer;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.HashSet;
import java.util.Set;

import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Testcontainers
class ClaimstreamsApplicationTests {

    @Container
    static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:16-alpine")
            .withDatabaseName("claimstream_db")
            .withUsername("postgres")
            .withPassword("password");

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName
            .parse("apache/kafka"));

    @Container
    static GenericContainer<?> redis = new GenericContainer<>(DockerImageName.parse("redis:7.2-alpine"))
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }

    @Autowired
    private ClaimProducer claimProducer;

    @Autowired
    private InsuranceClaimRepository claimRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClaimAuditLogRepository auditLogRepository;

    Policy activePolicy;

    @BeforeEach
    void setUp() {
        claimRepository.deleteAll();
        policyRepository.deleteAll();
        auditLogRepository.deleteAll();

        Set<Perils> perils = new HashSet<>();
        perils.add(Perils.FLOOD);
        perils.add(Perils.FIRE);
        perils.add(Perils.STORM);


        activePolicy = new Policy(
                "Anish",
                "anishdassatoffice@gmail.com",
                perils,
                new BigDecimal("10000.00"),
                new BigDecimal("250.00")
        );
        policyRepository.save(activePolicy);
    }

    @Test
    void testEndToEndAutoApproval() {
        InsuranceClaim claim = new InsuranceClaim(
                activePolicy,
                Perils.FLOOD,
                new BigDecimal("1500.00")
        );

        claimProducer.publishClaimSubmittedEvent(claim);

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> {
            var foundClaim = claimRepository.findByClaimId("CLM-TEST-8888");
            assertTrue(foundClaim.isPresent());
            assertEquals("AUTO_APPROVED", foundClaim.get().getStatus().name());
            assertEquals(new BigDecimal("1250.00"), foundClaim.get().getApprovedPayoutAmount());
        });

        var logs = auditLogRepository.findByClaimReference("CLM-TEST-8888");
        assertFalse(logs.isEmpty());
        assertEquals("AUTO_APPROVED", logs.get().getNewStatus().name());
    }

}
