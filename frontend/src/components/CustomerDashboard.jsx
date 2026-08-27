import { useState } from "react";
import renderStatusBadge from "./StatusBadge";
import RaiseClaimModal from "./RaiseClaimModal";
import { CustomerTopbar } from "./CustomerDashboard/CustomerTopbar";
import { CustomerClaimsList } from "./CustomerDashboard/CustomerClaimsList";
import { CustomerClaimDetails } from "./CustomerDashboard/CustomerClaimDetails";

export default function CustomerDashboard({ user }) {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const userPolicies = user?.policy
    ? Array.isArray(user.policy)
      ? user.policy
      : [user.policy]
    : [];

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans p-6'>
      <CustomerTopbar user={user} />

      <div className='grid grid-cols-12 gap-6'>
        <div className='col-span-7'>
          <CustomerClaimsList
            claims={user?.claims}
            selectedClaim={selectedClaim}
            setSelectedClaim={setSelectedClaim}
            renderStatusBadge={renderStatusBadge}
            setIsClaimModalOpen={setIsClaimModalOpen}
          />
        </div>

        <div className='col-span-5'>
          <CustomerClaimDetails
            selectedClaim={selectedClaim}
          />
        </div>
      </div>
      <RaiseClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        policies={userPolicies}
      />
    </div>
  );
}
