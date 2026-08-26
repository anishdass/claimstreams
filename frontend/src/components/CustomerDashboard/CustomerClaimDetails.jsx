export function CustomerClaimDetails({ selectedClaim }) {
  if (!selectedClaim) {
    return (
      <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex items-center justify-center min-h-[250px]'>
        <p className='text-xs text-slate-500'>
          Select a claim to view processing status and details.
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-lg backdrop-blur-sm'>
      <div className='flex items-center justify-between pb-4 border-b border-slate-800'>
        <div>
          <h2 className='text-sm font-semibold text-slate-200 uppercase tracking-wider'>
            Claim Details
          </h2>
          <p className='font-mono text-xs text-indigo-400 mt-1'>
            {selectedClaim.claimId}
          </p>
        </div>
      </div>

      <div className='mt-4 space-y-4 text-xs'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-slate-950/50 p-3 rounded-lg border border-slate-800/80'>
            <p className='text-slate-500 font-medium mb-1'>Claimed Amount</p>
            <p className='font-mono text-slate-100 text-sm font-semibold'>
              £{selectedClaim.claimedAmount?.toFixed(2)}
            </p>
          </div>
          <div className='bg-slate-950/50 p-3 rounded-lg border border-slate-800/80'>
            <p className='text-slate-500 font-medium mb-1'>Status</p>
            <p className='font-mono text-emerald-400 text-sm font-semibold'>
              {selectedClaim.status}
            </p>
          </div>
        </div>

        <div>
          <p className='text-slate-500 font-medium mb-1'>Incident Date</p>
          <p className='font-mono text-slate-300'>
            {selectedClaim.createdAt.split("T")[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
