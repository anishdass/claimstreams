import { Plus } from "lucide-react";
import { toast } from "react-toastify";

export function CustomerClaimsList({
  user,
  claims,
  selectedClaim,
  setSelectedClaim,
  renderStatusBadge,
  setIsClaimModalOpen,
}) {
  return (
    <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-lg backdrop-blur-sm'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-sm font-semibold text-slate-200 tracking-wider'>
          Your Claims
        </h2>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => {
              if (user?.isDefaultPassword) {
                toast.error("Change your password before raising a claim.");
                return;
              }
              setIsClaimModalOpen(true);
            }}
            className={`flex items-center justify-center w-7 h-7 rounded-lg ${
              user?.isDefaultPassword
                ? "bg-slate-600"
                : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
            } text-white font-bold text-base transition-all shadow-md active:scale-95 cursor-pointer`}
            title={
              user?.isDefaultPassword
                ? "Change your password before raising a claim"
                : "Raise New Claim"
            }>
            <Plus className='w-5 h-5' />
          </button>
        </div>
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
