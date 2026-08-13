// Function that returns the initial claims mock dataset for the Claims Dashboard
export const getInitialClaims = () => {
    const INITIAL_CLAIMS = [
      {
        id: "CLM-9021",
        policyId: "POL-88231",
        claimant: "Sarah Jenkins",
        claimedAmount: 1250.00,
        deductible: 250.00,
        payout: 0.00,
        status: "MANUAL_REVIEW",
        reason: "Audit Trigger: Round 1000 Multiple Threshold (£1,250.00)",
        incidentDate: "2026-03-28",
        category: "Property Damage"
      },
      {
        id: "CLM-9022",
        policyId: "POL-44102",
        claimant: "David Ross",
        claimedAmount: 420.50,
        deductible: 100.00,
        payout: 320.50,
        status: "AUTO_APPROVED",
        reason: "Straight-Through Adjudication Passed (Under £5,000 & Non-Round)",
        incidentDate: "2026-03-29",
        category: "Electronics"
      },
      {
        id: "CLM-9023",
        policyId: "POL-99120",
        claimant: "Elena Rostova",
        claimedAmount: 8500.00,
        deductible: 500.00,
        payout: 0.00,
        status: "HIGH_VALUE_AUDIT",
        reason: "Audit Trigger: Exceeds High-Value Boundary (£8,500.00 > £5,000.00)",
        incidentDate: "2026-03-29",
        category: "Vehicle Collision"
      },
      {
        id: "CLM-9024",
        policyId: "POL-11029",
        claimant: "Marcus Vance",
        claimedAmount: 2000.00,
        deductible: 200.00,
        payout: 0.00,
        status: "SLA_BREACH_ESCALATED",
        reason: "SLA Exceeded (>48 Hrs in Manual Queue) - Escalated to Senior Adjuster",
        incidentDate: "2026-03-25",
        category: "Commercial Theft"
      }
    ];
  
    return INITIAL_CLAIMS;
  };