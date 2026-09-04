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
  const [pageNumber, setPageNumber] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [status, setStatus] = useState("ALL");
  const [claimsMetrics, setClaimsMetrics] = useState(null);

  useEffect(() => {
    const fetchClaims = async (pageNumber) => {
      try {
        const updatedClaims = await getAllClaims(status, pageNumber);
        setClaims(updatedClaims.content || []);
        setPageData(updatedClaims);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      }
    };
    fetchClaims(pageNumber);
  }, [pageNumber, status]);

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans p-6'>
      {/* Header */}
      <Topbar
        setClaimsMetrics={setClaimsMetrics}
        setClaims={setClaims}
      />

      {/* Metrics Bar */}
      <MetricCard
        claimsMetrics={claimsMetrics}
        setClaimsMetrics={setClaimsMetrics}
      />

      {/* Workspace Grid */}
      <div className='grid grid-cols-12 gap-6'>
        <ClaimsTable
          claims={claims}
          status={status}
          setStatus={setStatus}
          selectedClaim={selectedClaim}
          setSelectedClaim={setSelectedClaim}
          renderStatusBadge={renderStatusBadge}
          setPageNumber={setPageNumber}
          pageData={pageData}
        />

        <ClaimDetails
          pageNumber={pageNumber}
          status={status}
          setClaims={setClaims}
          setSelectedClaim={setSelectedClaim}
          selectedClaim={selectedClaim}
          renderStatusBadge={renderStatusBadge}
        />
      </div>
    </div>
  );
}
