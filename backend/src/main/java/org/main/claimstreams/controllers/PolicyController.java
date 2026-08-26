package org.main.claimstreams.controllers;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.PolicyRequestDto;
import org.main.claimstreams.models.enums.Perils;
import org.main.claimstreams.services.PolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PostMapping("/create")
    public ResponseEntity<?> createPolicy(@RequestBody PolicyRequestDto request) {
        return policyService.createPolicy(request);
    }

    @GetMapping("/get-perils")
    public ResponseEntity<List<Perils>> getUpdatedPerils(){
        return policyService.getUpdatedPerils();
    }
}
