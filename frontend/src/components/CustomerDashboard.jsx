import { useEffect, useState } from "react";
import renderStatusBadge from "./StatusBadge";
import RaiseClaimModal from "./RaiseClaimModal";
import { CustomerTopbar } from "./CustomerDashboard/CustomerTopbar";
import { CustomerClaimsList } from "./CustomerDashboard/CustomerClaimsList";
import { CustomerClaimDetails } from "./CustomerDashboard/CustomerClaimDetails";
import { useAuth } from "../context/AuthContext";
import api from "../assets/api/axios";
import { getMyClaims } from "../assets/services/apiCalls";
import { toast } from "react-toastify";

export default function CustomerDashboard() {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const { user } = useAuth();
  const [claims, setClaims] = useState(null);

  const userPolicies = user?.policy
    ? Array.isArray(user.policy)
      ? user.policy
      : [user.policy]
    : [];

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyClaims();
        setClaims(response);
      } catch (error) {
        toast.error(error?.response?.message)
      }
    };
    getData();
  }, [claims]);

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans p-6'>
      <CustomerTopbar user={user} />

      <div className='grid grid-cols-12 gap-6'>
        <div className='col-span-7'>
          <CustomerClaimsList
            claims={claims}
            selectedClaim={selectedClaim}
            setSelectedClaim={setSelectedClaim}
            renderStatusBadge={renderStatusBadge}
            setIsClaimModalOpen={setIsClaimModalOpen}
          />
        </div>

        <div className='col-span-5'>
          <CustomerClaimDetails selectedClaim={selectedClaim} />
        </div>
      </div>
      <RaiseClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        policies={userPolicies}
        setClaims={setClaims}
      />
    </div>
  );
}
