package org.main.claimstreams.services;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.models.InsuranceClaim;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdjusterStreamService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "claims-payouts", groupId = "claimstream-dashboard-group")
    public void streamPayoutNotification(String payoutJson) {
        try {
            InsuranceClaim claim = objectMapper.readValue(payoutJson, InsuranceClaim.class);

            Map<String, Object> payload = Map.of(
                    "event", "PAYOUT_PROCESSED",
                    "claimReference", claim.getClaimId(),
                    "policyNumber", claim.getPolicy(),
                    "amountApproved", claim.getApprovedPayoutAmount(),
                    "riskScore", claim.getRiskScore(),
                    "timestamp", System.currentTimeMillis()
            );


            messagingTemplate.convertAndSend("/topics/claims-feed", (Object) payload);

            System.out.println("[WEBSOCKET BROADCAST] Real time payout streamed for: " + claim.getClaimId());

        } catch (Exception e) {
            System.err.println("Error streaming websocket notification: " + e.getMessage());
        }
    }
}
