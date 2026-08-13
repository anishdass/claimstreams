import { useState } from "react";
import { getInitialClaims } from "../data/mockClaims";
import Topbar from "./Topbar";
import MetricCard from "./MetricCard";
import ClaimsTable from "./ClaimsTable";
import ClaimDetails from "./ClaimDetails";

export default function InsurTechDashboard() {
  const [claims, setClaims] = useState(getInitialClaims());
  const [selectedClaim, setSelectedClaim] = useState(getInitialClaims()[0]);

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

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans p-6'>
      {/* Top Header & Context Banner */}
      <Topbar setClaims={setClaims} setSelectedClaim={setSelectedClaim} />

      {/* Real-time Telemetry Metrics Bar */}
      <MetricCard claims={claims} />

      {/* Workspace Grid */}
      <div className='grid grid-cols-12 gap-6'>
        <ClaimsTable
          claims={claims}
          selectedClaim={selectedClaim}
          setSelectedClaim={setSelectedClaim}
          renderStatusBadge={renderStatusBadge}
        />

        <ClaimDetails
          setClaims={setClaims}
          setSelectedClaim={setSelectedClaim}
          selectedClaim={selectedClaim}
          renderStatusBadge={renderStatusBadge}
        />
      </div>
    </div>
  );
}
