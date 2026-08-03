package org.main.claimstreams.Repositories;

import org.main.claimstreams.models.InsuranceClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {
    Optional<InsuranceClaim> findByClaimReference(String claimReference);

    List<InsuranceClaim> findByStatus(String status);
}
