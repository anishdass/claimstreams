import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../CommonComponents/LogoutButton";
import { Plus, UserPlus } from "lucide-react";
import CreatePolicyModal from "../CreatePolicyModal";
import RegisterModal from "../RegisterModal";
import SimulatePerilModal from "../SimulatePerilModal";

const Topbar = ({ setClaims, setSelectedClaim }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [openCreatePolicyModal, setOpenCreatePolicyModal] = useState(false);
  const [openSimulationModal, setOpenSimulationModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const { logout, user } = useAuth();

  const triggerSimulatedClaim = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const idNum = Math.floor(1000 + Math.random() * 9000);

      const possibleAmounts = [800, 1000, 2500, 3200, 6500, 10000];

      const claimed =
        possibleAmounts[Math.floor(Math.random() * possibleAmounts.length)];

      // Adjudication rules
      const isRoundThousand = claimed % 1000 === 0;
      const isHighValue = claimed > 5000;

      let status = "AUTO_APPROVED";
      let reason = "Straight-Through Adjudication Passed";
      let payout = claimed - 200;

      if (isHighValue) {
        status = "HIGH_VALUE_AUDIT";
        reason = `Audit Trigger: Exceeds High-Value Boundary (£${claimed.toFixed(
          2
        )} > £5,000.00)`;
        payout = 0;
      } else if (isRoundThousand) {
        status = "MANUAL_REVIEW";
        reason = `Audit Trigger: Exact Multiple of 1000 Detected (£${claimed.toFixed(
          2
        )})`;
        payout = 0;
      }

      const newClaim = {
        id: `CLM-${idNum}`,
        policyId: `POL-${Math.floor(10000 + Math.random() * 90000)}`,
        claimant: "Streamed Ingestion User",
        claimedAmount: claimed,
        deductible: 200.0,
        payout: payout > 0 ? payout : 0,
        status,
        reason,
        incidentDate: new Date().toISOString().split("T")[0],
        category: "Automated Ingestion",
      };

      setClaims((prev) => [newClaim, ...prev]);
      setSelectedClaim(newClaim);
      setIsSimulating(false);
    }, 600);
  };

  const onPolicyModalClose = () => {
    setOpenCreatePolicyModal(false);
  };

  const onRegisterModalClose = () => {
    setOpenRegisterModal(false);
  };

  const onSimulatePerilModalClose = () => {
    setOpenSimulationModal(false);
  };

  return (
    <header className='mb-8'>
      <div className='flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950/70 px-6 py-5 shadow-xl shadow-black/10 backdrop-blur-xl md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-4'>
          {/* Logo */}
          <div className='relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20'>
            <span className='text-xl'>🛡️</span>

            {/* Live indicator */}
            <span className='absolute -right-1 -top-1 flex h-4 w-4'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60'></span>
              <span className='relative inline-flex h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-500'></span>
            </span>
          </div>

          {/* Title */}
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-xl font-bold tracking-tight text-white'>
                Claim<span className='text-indigo-400'>Streams</span>
              </h1>

              <span className='rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400'>
                Live
              </span>
            </div>

            <p className='mt-1 text-xs text-slate-400'>
              Event-driven claims & adjudication control console
            </p>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 md:flex'>
            <span className='h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400'></span>

            <div className='leading-none'>
              <p className='text-[10px] font-medium uppercase tracking-wider text-slate-500'>
                Stream
              </p>
              <p className='mt-1 text-xs font-medium text-slate-300'>
                Kafka Connected
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenSimulationModal(true)}
            disabled={isSimulating}
            className='group relative flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0'>
            {/* Shine effect */}
            <span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full' />

            <span className='relative text-sm'>
              {isSimulating ? "⟳" : "⚡"}
            </span>

            <span className='relative'>
              {isSimulating ? "Ingesting Stream..." : "Simulate Incoming Claim"}
            </span>
          </button>

          <div className='h-6 w-[1px] bg-slate-800' />

          <LogoutButton logout={logout} />
        </div>
      </div>

      <div className='mt-3 flex items-center justify-between px-1 text-[11px] text-slate-500'>
        <div className='flex items-center gap-2'>
          <span className='text-slate-600'>SYSTEM</span>
          <span className='text-slate-700'>•</span>
          <span>Real-time event processing enabled</span>
        </div>
        <div className='flex items-center gap-2.5'>
          <button
            type='button'
            onClick={() => setOpenCreatePolicyModal(true)}
            className='inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95'>
            <Plus className='w-4 h-4' />
            <span>Create Policy</span>
          </button>
          {user.role == "ROLE_SENIOR_ADJUSTER" && (
            <button
              type='button'
              onClick={() => setOpenRegisterModal(true)}
              className='inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95'>
              <UserPlus className='w-4 h-4 text-slate-400' />
              <span>Register</span>
            </button>
          )}
        </div>
        <CreatePolicyModal
          isOpen={openCreatePolicyModal}
          onClose={onPolicyModalClose}
        />
        <RegisterModal
          isOpen={openRegisterModal}
          onClose={onRegisterModalClose}
        />
        <SimulatePerilModal
          isOpen={openSimulationModal}
          onClose={onSimulatePerilModalClose}
          setClaims={setClaims}
        />
      </div>
    </header>
  );
};

export default Topbar;
