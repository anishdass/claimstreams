package org.main.claimstreams.dtos;

import java.util.List;

public record PolicyRequestDto(String policyHolderEmail,
                               String policyHolderName,
                               List<String> coveredPeril,
                               String maxCoverageLimit,
                               String deductible) {
}
