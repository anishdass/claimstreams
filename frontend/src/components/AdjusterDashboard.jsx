import { useEffect, useState } from "react";
import Topbar from "./AdjusterDashboard/Topbar";
import MetricCard from "./AdjusterDashboard/MetricCard";
import ClaimsTable from "./AdjusterDashboard/ClaimsTable";
import ClaimDetails from "./AdjusterDashboard/ClaimDetails";
import renderStatusBadge from "./StatusBadge";
import { getAllClaims } from "../assets/services/apiCalls";

export default function AdjusterDashboard() {
  const [selectedClaim, setSelectedClaim] = useState();
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await getAllClaims();
        setClaims(res.data);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      }
    };

    fetchClaims();
  }, []);

  // Render nothing or a loading message while fetching
  if (!claims.length && !selectedClaim) {
    return (
      <div className='min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center'>
        <p>Loading claims data...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans p-6'>
      {/* Header */}
      <Topbar setClaims={setClaims} setSelectedClaim={setSelectedClaim} />

      {/* Metrics Bar */}
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
