package org.main.claimstreams.dtos;

public record AuthResponseDto(String token,
                              UserResponseDto user) {
}
