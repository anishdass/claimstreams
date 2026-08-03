package org.main.claimstreams.Repositories;

import org.main.claimstreams.models.ClaimAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClaimAuditLogRepository extends JpaRepository<ClaimAuditLog, Long> {
    Optional<ClaimAuditLog> findByClaimReference(String claimReference);
}
