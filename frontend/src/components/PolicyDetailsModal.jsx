export function PolicyDetailsModal({ claim, onClose }) {
  console.log(claim);

  return (
    /* Modal Backdrop Overlay */
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      {/* Modal Dialog Card */}
      <div className='bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150'>
        {/* Header */}
        <div className='flex items-center justify-between pb-4 border-b border-slate-800'>
          <div>
            <span className='text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold'>
              Policy Overview
            </span>
            <h2 className='text-xl font-bold text-white font-mono'>
              {claim.policy.policyNumber}
            </h2>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='text-slate-400 hover:text-white text-lg font-bold px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors'>
            ✕
          </button>
        </div>

        {/* Policy Details Grid */}
        <div className='grid grid-cols-2 gap-4 py-4 text-sm border-b border-slate-800'>
          <div>
            <p className='text-slate-400 text-xs'>Coverage</p>
            <p className='font-semibold text-slate-200'>
              {claim.policy.maxCoverageLimit}
            </p>
          </div>
          <div>
            <p className='text-slate-400 text-xs'>Deductible</p>
            <p className='font-semibold text-emerald-400'>
              ${claim.policy.deductible}
            </p>
          </div>
          <div>
            <p className='text-slate-400 text-xs'>Effective date</p>
            <p className='font-mono text-xs text-slate-300'>
              {claim.policy.effectiveDate.split('T')[0]}
            </p>
          </div>
          <div>
            <p className='text-slate-400 text-xs'>Expiration Date</p>
            <p
              className={`font-mono text-xs ${
                new Date(claim.policy.expirationDate) < new Date()
                  ? "text-red-400"
                  : "text-slate-300"
              }`}>
              {claim.policy.expirationDate.split('T')[0]}
            </p>
          </div>
          <div>
            <p className='text-slate-400 text-xs'>Covered Peril</p>
            <p className='font-mono text-xs text-slate-300'>
              {claim.policy.coveredPeril.map((peril, index) => (
                <span key={index} className='inline-flex items-center gap-2'>
                  {index >= 0 && (
                    <span className='text-slate-50 leading-none'> </span>
                  )}
                  <span>{peril}</span>
                </span>
              ))}
            </p>
          </div>
          <div>
            <p className='text-slate-400 text-xs'>Status</p>
            <p
              className={`font-mono text-xs ${
                claim.policy.status?.toUpperCase() === "ACTIVE"
                  ? "text-slate-300"
                  : "text-red-400"
              }`}>
              {claim.policy.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolicyDetailsModal;
