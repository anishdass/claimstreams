package org.main.claimstreams.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.claimstreams.configs.PolicyStatus;

import java.math.BigDecimal;

@Getter
@Entity
@Table(name = "claim_policies")
@NoArgsConstructor
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String policyNumber;

    @Column(nullable = false)
    private String policyHolderName;

    @Column(nullable = false)
    private String coveredPeril;

    @Column(nullable = false)
    private BigDecimal maxCoverageLimit;

    @Column(nullable = false)
    private BigDecimal deductible;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PolicyStatus status = PolicyStatus.ACTIVE;

    public Policy(String policyNumber, String policyHolderName, String coveredPeril, BigDecimal maxCoverageLimit, BigDecimal deductible) {
        this.policyNumber = policyNumber;
        this.policyHolderName = policyHolderName;
        this.coveredPeril = coveredPeril;
        this.maxCoverageLimit = maxCoverageLimit;
        this.deductible = deductible;
    }

}
