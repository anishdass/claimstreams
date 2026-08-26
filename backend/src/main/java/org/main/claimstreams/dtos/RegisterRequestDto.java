package org.main.claimstreams.dtos;

import org.main.claimstreams.models.enums.UserRole;

public record RegisterRequestDto(String email,
                                 String password,
                                 String fullName,
                                 UserRole role) {
}
