package org.main.claimstreams.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.models.enums.Perils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "insurance_claims")
@NoArgsConstructor
@Getter
public class InsuranceClaim {
    @Id
    @Column(nullable = false, unique = true, name = "claim_id")
    private String claimId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_number", referencedColumnName = "policy_number", nullable = false)
    private Policy policy;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"policies", "claims", "password"})
    private User user;

    @Column(nullable = false)
    private Perils perilType;

    @Column(nullable = false)
    private BigDecimal claimedAmount;

    @Setter
    private BigDecimal approvedPayoutAmount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Setter
    private InsuranceClaimStatus status;

    @Column(nullable = false)
    @Setter
    private int riskScore;

    @Version
    private Long version;

    @Setter
    private String reason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InsuranceClaim(Policy policy, Perils perilType, BigDecimal claimedAmount) {
        this.claimId = "CLM-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.policy = policy;
        this.perilType = perilType;
        this.claimedAmount = claimedAmount;
        this.status = InsuranceClaimStatus.SUBMITTED;
        this.riskScore = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
