export function CustomerClaimsList({
  claims,
  selectedClaim,
  setSelectedClaim,
  renderStatusBadge,
  setIsClaimModalOpen,
}) {

  console.log(claims);
  

  return (
    <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-lg backdrop-blur-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-sm font-semibold text-slate-200 uppercase tracking-wider'>
          Your Claims
        </h2>
        {/* Modal Trigger Button */}
        <button
          onClick={() => setIsClaimModalOpen(true)}
          className='flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-md shadow-indigo-600/30 active:scale-95'
          title='Raise New Claim'>
          +
        </button>
      </div>
      <div className='space-y-3'>
        {claims?.length ? (
          claims.map((claim) => {
            const isSelected = selectedClaim?.claimId === claim.claimId;
            return (
              <div
                key={claim.id}
                onClick={() => setSelectedClaim(claim)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-500/10"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}>
                <div className='flex items-center justify-between'>
                  <span className='font-mono text-xs text-indigo-400 font-medium'>
                    {claim.claimId}
                  </span>
                  {renderStatusBadge ? (
                    renderStatusBadge(claim.status)
                  ) : (
                    <span className='text-xs font-mono text-slate-400'>
                      {claim.status}
                    </span>
                  )}
                </div>
                <div className='mt-2 flex justify-between items-end text-xs'>
                  <div>
                    <p className='text-slate-500 text-[11px] font-mono mt-0.5'>
                      Filed: {claim.createdAt.split("T")[0]}
                    </p>
                  </div>
                  <p className='font-mono text-slate-200 font-semibold text-sm'>
                    £{claim.claimedAmount?.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className='text-xs text-slate-500 py-4 text-center'>
            No submitted claims found.
          </p>
        )}
      </div>
    </div>
  );
}
