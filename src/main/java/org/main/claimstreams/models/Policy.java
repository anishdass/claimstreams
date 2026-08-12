package org.main.claimstreams.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.claimstreams.models.enums.Peril;
import org.main.claimstreams.models.enums.PolicyStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Entity
@Table(name = "claim_policies")
@NoArgsConstructor
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String policyNumber;

    @Column(nullable = false)
    private String policyHolderName;

    @Column(nullable = false)
    private String policyHolderEmailId;

    @ElementCollection(targetClass = Peril.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "policy_perils", joinColumns = @JoinColumn(name = "policy_id"))
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Set<Peril> coveredPeril = new HashSet<>();

    @Column(nullable = false)
    private BigDecimal maxCoverageLimit;

    @Column(nullable = false)
    private BigDecimal deductible;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PolicyStatus status = PolicyStatus.ACTIVE;

    public Policy(String policyHolderName, String policyHolderEmailId, Set<Peril> coveredPeril, BigDecimal maxCoverageLimit, BigDecimal deductible) {
        this.policyNumber = "POL-UK-" + LocalDateTime.now().getYear() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.policyHolderName = policyHolderName;
        this.policyHolderEmailId = policyHolderEmailId;
        this.coveredPeril = coveredPeril;
        this.maxCoverageLimit = maxCoverageLimit;
        this.deductible = deductible;
    }

}
