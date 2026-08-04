package org.main.claimstreams.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    private String perilType;

    @Column(nullable = false)
    private BigDecimal claimedAmount;

    @Setter
    private BigDecimal approvedPayoutAmount;

    @Column(nullable = false)
    @Setter
    private String status;

    @Column(nullable = false)
    @Setter
    private int riskScore;

    @Version
    private Long version;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InsuranceClaim(String claimReference, String policyNumber, String perilType, BigDecimal claimedAmount) {
        this.claimReference = claimReference;
        this.policyNumber = policyNumber;
        this.perilType = perilType;
        this.claimedAmount = claimedAmount;
        this.status = "SUBMITTED";
        this.riskScore = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
