import { useState } from "react";

const ClaimsTable = ({
  claims,
  selectedClaim,
  setSelectedClaim,
  renderStatusBadge,
}) => {
  const [filter, setFilter] = useState("ALL");

  const filteredClaims = claims.filter((c) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING")
      return (
        c.status === "MANUAL_REVIEW" ||
        c.status === "HIGH_VALUE_AUDIT" ||
        c.status === "SLA_BREACH_ESCALATED"
      );
    return c.status === filter;
  });

  return (
    <div className='col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-semibold tracking-wider text-slate-300 uppercase'>
          Live Claim Stream
        </h3>
        <div className='flex gap-2'>
          {["ALL", "PENDING", "AUTO_APPROVED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                filter === f
                  ? "bg-slate-800 border-indigo-500 text-indigo-400"
                  : "border-slate-800 text-slate-400 hover:border-slate-700"
              }`}>
              {f === "PENDING" ? "Requires Action" : f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
        {filteredClaims.map((claim) => (
          <div
            key={claim.id}
            onClick={() => setSelectedClaim(claim)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedClaim?.id === claim.id
                ? "bg-indigo-950/40 border-indigo-500/80 shadow-md"
                : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
            }`}>
            <div className='flex justify-between items-start'>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-xs text-indigo-400 font-bold'>
                    {claim.id}
                  </span>
                  <span className='text-xs text-slate-500'>•</span>
                  <span className='text-xs text-slate-400 font-medium'>
                    {claim.claimant}
                  </span>
                </div>
                <p className='text-xs text-slate-400 mt-1 line-clamp-1'>
                  {claim.reason}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-sm font-mono font-semibold text-slate-200'>
                  £{claim.claimedAmount.toFixed(2)}
                </p>
                <div className='mt-1'>{renderStatusBadge(claim.status)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimsTable;
