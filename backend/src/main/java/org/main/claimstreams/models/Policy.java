package org.main.claimstreams.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.main.claimstreams.models.enums.Perils;
import org.main.claimstreams.models.enums.PolicyStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Entity
@Table(name = "policy")
@NoArgsConstructor
public class Policy {
    @Id
    @Column(name = "policy_number", nullable = false, unique = true, updatable = false)
    private String policyNumber;

    @Setter
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"policies", "claims", "password"})
    private User user;

    @ElementCollection(targetClass = Perils.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "policy_perils", joinColumns = @JoinColumn(name = "policy_number"))
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Set<Perils> coveredPeril = new HashSet<>();

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

    public Policy(Set<Perils> coveredPeril, BigDecimal maxCoverageLimit, BigDecimal deductible) {
        this.policyNumber = "POL-UK-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.coveredPeril = coveredPeril;
        this.maxCoverageLimit = maxCoverageLimit;
        this.deductible = deductible;
        this.effectiveDate = LocalDateTime.now();
        this.expirationDate = LocalDateTime.now().plusYears(1);
    }

}
