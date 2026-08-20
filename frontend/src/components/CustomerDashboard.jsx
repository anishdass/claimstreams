import { useState } from "react";
import renderStatusBadge from "./StatusBadge";
import RaiseClaimModal from "./RaiseClaimModal";
import { CustomerTopbar } from "./CustomerDashboard/CustomerTopbar";
import { CustomerClaimsList } from "./CustomerDashboard/CustomerClaimsList";
import { CustomerClaimDetails } from "./CustomerDashboard/CustomerClaimDetails";

export default function CustomerDashboard({ user }) {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimsList, setClaimsList] = useState(user?.claims || []);

  const userPolicies = user?.policy
    ? Array.isArray(user.policy)
      ? user.policy
      : [user.policy]
    : [];

  const handleClaimSubmit = (newClaimData) => {
    const newClaim = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      claimedAmount: newClaimData.claimedAmount,
      payout: null,
      status: "SUBMITTED",
      incidentDate: new Date().toISOString().split("T")[0],
      category: newClaimData.perilType,
    };

    setClaimsList((prev) => [newClaim, ...prev]);
    setSelectedClaim(newClaim);
  };

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans p-6'>
      {/* Portal Top Header */}
      <CustomerTopbar user={user} />

      {/* Main Grid: Side-by-Side Split Column Workspace */}
      <div className='grid grid-cols-12 gap-6'>
        {/* Left Column: Claims List */}
        <div className='col-span-7'>
          <CustomerClaimsList
            claims={user?.claims}
            selectedClaim={selectedClaim}
            setSelectedClaim={setSelectedClaim}
            renderStatusBadge={renderStatusBadge}
            setIsClaimModalOpen={setIsClaimModalOpen}
          />
        </div>

        {/* Right Column: Claim Details Workspace */}
        <div className='col-span-5'>
          <CustomerClaimDetails
            selectedClaim={selectedClaim}
            renderStatusBadge={renderStatusBadge}
          />
        </div>
      </div>
      <RaiseClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        policies={userPolicies}
        onSubmitClaim={handleClaimSubmit}
      />
    </div>
  );
}
