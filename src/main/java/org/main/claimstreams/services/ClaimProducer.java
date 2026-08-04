package org.main.claimstreams.services;

import lombok.AllArgsConstructor;
import org.main.claimstreams.models.InsuranceClaim;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;


@Service
@AllArgsConstructor
public class ClaimProducer {
    private static final String TOPIC = "claims-submitted";
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void publishClaimSubmittedEvent(InsuranceClaim claim) {
        String jsonPayload = objectMapper.writeValueAsString(claim);
        kafkaTemplate.send(TOPIC, claim.getPolicyNumber(), jsonPayload);
        System.out.println("[KAFKA PRODUCER] Claim queues: " + claim.getClaimReference());
    }
}
