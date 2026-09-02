package org.main.claimstreams.dtos;

public record ChangePasswordRequestDto(String oldPassword, String newPassword) {
}
