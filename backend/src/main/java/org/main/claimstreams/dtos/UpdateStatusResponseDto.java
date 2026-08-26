package org.main.claimstreams.dtos;

public record UpdateStatusResponseDto(String status, String claimId, String updatedStatus, String overridenBy) {
}
