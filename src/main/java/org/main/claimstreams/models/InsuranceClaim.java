package org.main.claimstreams.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.models.enums.Peril;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "insurance_claims")
@NoArgsConstructor
@Getter
public class InsuranceClaim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String claimReference;

    @Column(nullable = false)
    private String policyNumber;

    @Column(nullable = false)
    private Peril perilType;

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

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InsuranceClaim(String policyNumber, Peril perilType, BigDecimal claimedAmount) {
        this.claimReference = "CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.policyNumber = policyNumber;
        this.perilType = perilType;
        this.claimedAmount = claimedAmount;
        this.status = InsuranceClaimStatus.SUBMITTED;
        this.riskScore = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
