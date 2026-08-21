package org.main.claimstreams.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.claimstreams.models.enums.Peril;
import org.main.claimstreams.models.enums.PolicyCategory;
import org.main.claimstreams.models.enums.PolicyStatus;
import org.main.claimstreams.models.enums.PolicySubcategory;

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
    @Column(name = "policy_number", nullable = false, unique = true, updatable = false)
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

    @Enumerated(EnumType.STRING)
    @Column(name = "policy_category", nullable = false)
    private PolicyCategory policyCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "policy_subcategory", nullable = false)
    private PolicySubcategory policySubcategory;

    @Column(nullable = false)
    private BigDecimal maxCoverageLimit;

    @Column(nullable = false)
    private BigDecimal deductible;

    @Column(name = "effective_date", nullable = false)
    LocalDateTime effectiveDate;

    @Column(name = "expiration_date", nullable = false)
    LocalDateTime expirationDate;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PolicyStatus status = PolicyStatus.ACTIVE;

    @PreUpdate
    @PrePersist
    private void validateCategorySubcategoryMismatch() {
        if (policySubcategory != null && policySubcategory.getPolicyCategory() != policyCategory) {
            throw new IllegalArgumentException(
                    "Invalid Policy Subcategory '" + policySubcategory + "' for selected Policy category '" + policySubcategory + "'"
            );
        }
    }


    public Policy(String policyHolderName, String policyHolderEmailId, Set<Peril> coveredPeril, BigDecimal maxCoverageLimit, BigDecimal deductible) {
        this.policyNumber = "POL-UK-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.policyHolderName = policyHolderName;
        this.policyHolderEmailId = policyHolderEmailId;
        this.coveredPeril = coveredPeril;
        this.maxCoverageLimit = maxCoverageLimit;
        this.deductible = deductible;
        this.effectiveDate = LocalDateTime.now();
        this.expirationDate = LocalDateTime.now();
    }

}
