import { useState } from "react";
import { getInitialClaims } from "../data/mockClaims";
import Topbar from "./AdjusterDashboard/Topbar";
import MetricCard from "./AdjusterDashboard/MetricCard";
import ClaimsTable from "./AdjusterDashboard/ClaimsTable";
import ClaimDetails from "./AdjusterDashboard/ClaimDetails";
import renderStatusBadge from "./StatusBadge";

export default function AdjusterDashboard() {
  const [claims, setClaims] = useState(getInitialClaims());
  const [selectedClaim, setSelectedClaim] = useState(getInitialClaims()[0]);

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
