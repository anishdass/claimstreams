package org.main.claimstreams.repositories;

import org.main.claimstreams.models.User;
import org.main.claimstreams.models.enums.InsuranceClaimStatus;
import org.main.claimstreams.models.InsuranceClaim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, String> {
    Optional<InsuranceClaim> findByClaimId(String claimReference);

    Optional<List<InsuranceClaim>> findByUser(User user);

    List<InsuranceClaim> findByStatusIn(Collection<InsuranceClaimStatus> statuses);

    Page<InsuranceClaim> findByStatus(InsuranceClaimStatus status, Pageable pageable);

    int countByStatus(InsuranceClaimStatus status);
}
