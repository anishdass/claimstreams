import { useState } from "react";
import { getInitialClaims } from "../data/mockClaims";
import Topbar from "./Topbar";
import MetricCard from "./MetricCard";

export default function InsurTechDashboard() {
  const [claims, setClaims] = useState(getInitialClaims());
  const [selectedClaim, setSelectedClaim] = useState(getInitialClaims()[0]);
  const [filter, setFilter] = useState("ALL");

  // Status Badge Renderer
  const renderStatusBadge = (status) => {
    switch (status) {
      case "AUTO_APPROVED":
        return (
          <span className='bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
            🟢 Auto Approved
          </span>
        );
      case "MANUAL_REVIEW":
        return (
          <span className='bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
            ⚠️ Manual Review
          </span>
        );
      case "HIGH_VALUE_AUDIT":
        return (
          <span className='bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
            🔍 High Value Audit
          </span>
        );
      case "SLA_BREACH_ESCALATED":
        return (
          <span className='bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full font-medium animate-pulse'>
            🚨 SLA Breach
          </span>
        );
      case "SENIOR_APPROVED":
        return (
          <span className='bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
            👤 Senior Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className='bg-slate-700 text-slate-400 border border-slate-600 text-xs px-2.5 py-1 rounded-full font-medium'>
            🚫 Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Handle Adjuster manual overrides
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
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans p-6'>
      {/* Top Header & Context Banner */}
      <Topbar setClaims={setClaims} setSelectedClaim={setSelectedClaim}/>

      {/* Real-time Telemetry Metrics Bar */}
      <MetricCard claims={claims} />

      {/* Workspace Grid */}
      <div className='grid grid-cols-12 gap-6'>
        {/* Left Column: Stream Queue & Filters (7 Columns) */}
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
                    <div className='mt-1'>
                      {renderStatusBadge(claim.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Adjudication Workspace (5 Columns) */}
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
                  <span className='font-mono text-slate-200'>
                    {selectedClaim.policyId}
                  </span>
                </div>
                <div className='flex justify-between text-xs'>
                  <span className='text-slate-400'>Category:</span>
                  <span className='text-slate-200'>
                    {selectedClaim.category}
                  </span>
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
      </div>
    </div>
  );
}
