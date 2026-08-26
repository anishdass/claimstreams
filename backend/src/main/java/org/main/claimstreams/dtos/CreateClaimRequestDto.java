package org.main.claimstreams.dtos;

import org.main.claimstreams.models.enums.Perils;

public record CreateClaimRequestDto(String policyNumber, Perils perilType, String claimedAmount) {
}
