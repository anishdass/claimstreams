import { useState } from "react";

const Topbar = ({setClaims, setSelectedClaim}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate incoming real-time claims stream (Kafka Mock)
  const triggerSimulatedClaim = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const idNum = Math.floor(1000 + Math.random() * 9000);
      const possibleAmounts = [800, 1000, 2500, 3200, 6500, 10000];
      const claimed =
        possibleAmounts[Math.floor(Math.random() * possibleAmounts.length)];

      // Mirroring BigDecimal modulus adjudication rules
      const isRoundThousand = claimed % 1000 === 0;
      const isHighValue = claimed > 5000;

      let status = "AUTO_APPROVED";
      let reason = "Straight-Through Adjudication Passed";
      let payout = claimed - 200;

      if (isHighValue) {
        status = "HIGH_VALUE_AUDIT";
        reason = `Audit Trigger: Exceeds High-Value Boundary (£${claimed.toFixed(
          2
        )} > £5,000.00)`;
        payout = 0;
      } else if (isRoundThousand) {
        status = "MANUAL_REVIEW";
        reason = `Audit Trigger: Exact Multiple of 1000 Detected (£${claimed.toFixed(
          2
        )})`;
        payout = 0;
      }

      const newClaim = {
        id: `CLM-${idNum}`,
        policyId: `POL-${Math.floor(10000 + Math.random() * 90000)}`,
        claimant: "Streamed Ingestion User",
        claimedAmount: claimed,
        deductible: 200.0,
        payout: payout > 0 ? payout : 0,
        status: status,
        reason: reason,
        incidentDate: new Date().toISOString().split("T")[0],
        category: "Automated Ingestion",
      };

      setClaims((prev) => [newClaim, ...prev]);
      setSelectedClaim(newClaim);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div>
      <header className='flex items-center justify-between border-b border-slate-800 pb-5 mb-6'>
        <div className='flex items-center gap-3'>
          <div className='bg-indigo-600 p-64 rounded-lg text-white font-bold'>
            🛡️
          </div>
          <div>
            <h1 className='text-xl font-bold tracking-wide'>
              InsurTech Adjudication Engine
            </h1>
            <p className='text-xs text-slate-400'>
              Live Event-Driven Stream & Adjuster Control Console
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={triggerSimulatedClaim}
            disabled={isSimulating}
            className='bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30'>
            {isSimulating
              ? "⚡ Ingesting Stream..."
              : "⚡ Simulate Incoming Claim Stream"}
          </button>
        </div>
      </header>
    </div>
  );
};

export default Topbar;
