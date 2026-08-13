import { useState } from "react";

const ClaimDetails = ({
  setClaims,
  setSelectedClaim,
  selectedClaim,
  renderStatusBadge,
}) => {
  const [activeModalClaim, setActiveModalClaim] = useState(null);

  const handleOpenPolicyModal = (claim) => {
    setActiveModalClaim(claim);
  };
  
  const hanleCloseModal = () => {
    setActiveModalClaim(null);
  };

  const handleApprove = (claimId) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const payout = c.claimedAmount - c.deductible;
          const updated = {
            ...c,
            status: "SENIOR_APPROVED",
            payout: payout > 0 ? payout : 0,
          };
          setSelectedClaim(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const handleReject = (claimId) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updated = { ...c, status: "REJECTED", payout: 0 };
          setSelectedClaim(updated);
          return updated;
        }
        return c;
      })
    );
  };

  return (
    <div className='col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between'>
      <div>
        <div className='border-b border-slate-800 pb-3 mb-4 flex justify-between items-center'>
          <div>
            <h3 className='text-sm font-semibold text-slate-300'>
              Adjudication Detail Inspector
            </h3>
            <span className='text-xs font-mono text-indigo-400'>
              {selectedClaim.id}
            </span>
          </div>
          {renderStatusBadge(selectedClaim.status)}
        </div>

        <div className='space-y-4'>
          <div className='bg-slate-950 p-3.5 rounded-lg border border-slate-800/60'>
            <span className='text-xs text-slate-400'>
              Adjudication Engine Audit Log
            </span>
            <p className='text-xs text-amber-300 font-mono mt-1 leading-relaxed'>
              {selectedClaim.reason}
            </p>
          </div>

          <div className='space-y-2 border-t border-b border-slate-800/80 py-3'>
            <div className='flex justify-between text-xs'>
              <span className='text-slate-400'>Policy Holder:</span>
              <span className='font-medium text-slate-200'>
                {selectedClaim.claimant}
              </span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-slate-400'>Policy Identifier:</span>
              <button
                type='button'
                onClick={() =>
                  alert(`Policy ID clicked: ${selectedClaim.policyId}`)
                }
                className='font-mono text-xs font-semibold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-600 hover:text-white border border-indigo-500/50 hover:border-indigo-400 rounded-full px-3 py-1 shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/50 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 active:scale-95'>
                {selectedClaim.policyId}
              </button>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-slate-400'>Category:</span>
              <span className='text-slate-200'>{selectedClaim.category}</span>
            </div>
          </div>

          <div className='space-y-2'>
            <h4 className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
              Financial Calculations
            </h4>
            <div className='flex justify-between text-sm'>
              <span className='text-slate-400'>Gross Claimed Amount:</span>
              <span className='font-mono text-slate-200'>
                £{selectedClaim.claimedAmount.toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-slate-400'>Policy Deductible:</span>
              <span className='font-mono text-rose-400'>
                - £{selectedClaim.deductible.toFixed(2)}
              </span>
            </div>
            <div className='border-t border-slate-800 pt-2 flex justify-between text-base font-bold'>
              <span className='text-slate-300'>Net Calculated Payout:</span>
              <span className='font-mono text-indigo-400'>
                £{selectedClaim.payout.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Adjuster Action Controls */}
      <div className='mt-6 border-t border-slate-800 pt-4'>
        <h4 className='text-xs font-semibold text-slate-400 mb-2'>
          Adjuster Override Panel
        </h4>
        <div className='flex gap-3'>
          <button
            onClick={() => handleApprove(selectedClaim.id)}
            disabled={
              selectedClaim.status === "AUTO_APPROVED" ||
              selectedClaim.status === "SENIOR_APPROVED"
            }
            className='flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-lg transition-all'>
            Manual Approve
          </button>
          <button
            onClick={() => handleReject(selectedClaim.id)}
            disabled={selectedClaim.status === "REJECTED"}
            className='flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white text-xs font-semibold py-2.5 rounded-lg transition-all'>
            Reject Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetails;
