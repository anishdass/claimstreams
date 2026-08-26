import { Calendar, FileText, User } from "lucide-react";
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
    return c.status === filter;
  });

  return (
    <div className='col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-semibold tracking-wider text-slate-300 uppercase'>
          Live Claim Stream
        </h3>
        <div className='flex gap-2'>
          {["ALL", "MANUAL_REVIEW", "SUBMITTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                filter === f
                  ? "bg-slate-800 border-indigo-500 text-indigo-400"
                  : "border-slate-800 text-slate-400 hover:border-slate-700"
              }`}>
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
        {filteredClaims.map((claim) => (
          <div
            key={claim.claimId}
            onClick={() => setSelectedClaim(claim)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedClaim?.id === claim.id
                ? "bg-indigo-950/40 border-indigo-500/80 shadow-md"
                : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
            }`}>
            <div className='flex justify-between items-start'>
              <div>
                {/* Claim Identifier & Policyholder Info */}
                <div className='flex items-center gap-2 mb-1'>
                  <div className='flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md'>
                    <FileText className='w-3 h-3 text-indigo-400' />
                    <span className='font-mono text-xs text-indigo-300 font-bold tracking-tight'>
                      {claim?.claimId}
                    </span>
                  </div>

                  <div className='flex items-center gap-1 text-slate-300 text-xs font-medium'>
                    <User className='w-3 h-3 text-slate-500' />
                    <span>
                      {claim?.user?.fullName || "Unknown Policyholder"}
                    </span>
                  </div>
                </div>

                {/* Ingestion Date */}
                <div className='flex items-center gap-1.5 text-xs text-slate-400 pl-0.5'>
                  <Calendar className='w-3 h-3 text-slate-500' />
                  <time className='font-mono text-[11px] text-slate-400'>
                    {claim?.createdAt ? claim.createdAt.split("T")[0] : "N/A"}
                  </time>
                </div>
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
