package org.main.claimstreams.dtos;

import org.main.claimstreams.models.InsuranceClaim;
import org.main.claimstreams.models.Policy;
import org.main.claimstreams.models.enums.UserRole;

import java.util.List;

public record UserResponseDto(UserRole role,
                              String email,
                              String fullName,
                              boolean isDefaultPassword,
                              List<Policy> policy,
                              List<InsuranceClaim> claims) {
}
