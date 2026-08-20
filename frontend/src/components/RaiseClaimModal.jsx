import { useState } from "react";

const RaiseClaimModal = ({ isOpen, onClose, policies, onSubmitClaim }) => {
  const [selectedPolicyId, setSelectedPolicyId] = useState(
    policies?.[0]?.policyNumber || ""
  );
  const [selectedPeril, setSelectedPeril] = useState("");
  const [claimedAmount, setClaimedAmount] = useState("");

  if (!isOpen) return null;

  // Locate current policy context to populate peril options dynamically
  const activePolicy = policies?.find(
    (p) => p.policyNumber === selectedPolicyId
  );
  const availablePerils = activePolicy?.coveredPerils || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPolicyId || !selectedPeril || !claimedAmount) return;

    onSubmitClaim({
      policyId: selectedPolicyId,
      perilType: selectedPeril,
      claimedAmount: parseFloat(claimedAmount),
    });

    onClose();
  };

  console.log(policies[0].policyNumber);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <div className='bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl'>
        <div className='flex justify-between items-center border-b border-slate-800 pb-3 mb-4'>
          <h3 className='text-sm font-semibold text-slate-200'>
            Raise New Claim
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-white text-xs font-mono'>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Policy Selection Dropdown */}
          <div>
            <label className='block text-xs font-medium text-slate-400 mb-1'>
              Select Policy Number
            </label>
            <select
              value={selectedPolicyId}
              onChange={(e) => {
                setSelectedPolicyId(e.target.value);
                setSelectedPeril(""); // Reset peril when policy changes
              }}
              className='w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required>
              <option value='' disabled>
                Select Policy
              </option>
              {policies?.map((policy) => (
                <option key={policy.policyNumber} value={policy.policyNumber}>
                  {policy.policyNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Covered Peril Type Dropdown */}
          <div>
            <label className='block text-xs font-medium text-slate-400 mb-1'>
              Covered Peril Type
            </label>
            <select
              value={selectedPeril}
              onChange={(e) => setSelectedPeril(e.target.value)}
              className='w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required>
              <option value='' disabled>
                Select Peril Type
              </option>
              {availablePerils.map((peril, idx) => (
                <option key={idx} value={peril}>
                  {peril}
                </option>
              ))}
            </select>
          </div>

          {/* Claimed Amount Input */}
          <div>
            <label className='block text-xs font-medium text-slate-400 mb-1'>
              Claimed Amount (£)
            </label>
            <input
              type='number'
              step='0.01'
              value={claimedAmount}
              onChange={(e) => setClaimedAmount(e.target.value)}
              placeholder='e.g. 1250.00'
              className='w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 pt-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all active:scale-95'>
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseClaimModal;
