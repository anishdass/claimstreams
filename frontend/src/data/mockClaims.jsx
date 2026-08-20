// Function that returns the initial claims mock dataset for the Claims Dashboard
export const getInitialClaims = () => {
  const INITIAL_CLAIMS = [
    {
      claimId: "CLM-2026-12345678",
      policy: {
        policyNumber: "POL-2026-12345678",
        policyHolderName: "Sarah Jenkins",
        policyHolderEmailId: "SarahJenkins@gmail.com",
        coveredPerils: ["STORM", "FLOOD", "FIRE"],
        category: "Personal",
        subCategory: "Auto/ Motor",
        maxCoverageLimit: 10000.0,
        deductible: 250.00,
        effectiveDate: "2023-01-01",
        expirationDate: "2025-01-01",
        status: "SUSPENDED",
      },
      perilType: "STORM",
      claimedAmount: 1000.0,
      approvedPayoutAmount: 500.0,
      status: "MANUAL_REVIEW",
      riskScore: 40,
      reason:"dummyReason",
      createdAt: "2026-03-28",
      updatedAt: "2026-03-28",
    },
  ];

  return INITIAL_CLAIMS;
};
