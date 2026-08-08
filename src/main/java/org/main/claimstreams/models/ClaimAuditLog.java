package org.main.claimstreams.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim_audit_logs")
@NoArgsConstructor
@Getter
public class ClaimAuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String claimReference;

    @Column(nullable = false)
    private InsuranceClaimStatus previousStatus;

    @Column(nullable = false)
    private InsuranceClaimStatus newStatus;

    @Column(nullable = false)
    private String reasonNote;

    @Column(nullable = false)
    private LocalDateTime loggedAt;

    public ClaimAuditLog(String claimReference, InsuranceClaimStatus previousStatus, InsuranceClaimStatus newStatus, String reasonNote) {
        this.claimReference = claimReference;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.reasonNote = reasonNote;
        this.loggedAt = LocalDateTime.now();
    }
}
