import { SquareUser } from "lucide-react";
import ProfileBadge from "../ProfileBadge";

export function CustomerTopbar({ user }) {
  return (
    <header className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6 bg-slate-900/40 backdrop-blur-md px-6 pt-4 rounded-2xl border border-slate-800/50 shadow-xl shadow-black/20'>
      {/* Left: Branding & Telemetry */}
      <div className='flex items-center gap-4'>
        <div className='relative p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-indigo-500/10 to-purple-500/5 border border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-500/10'>
          <SquareUser className='w-6 h-6' />
          <span className='absolute -top-1 -right-1 flex h-3 w-3'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-950'></span>
          </span>
        </div>

        <div className='space-y-1'>
          <div className='flex items-center flex-wrap gap-2.5'>
            <h1 className='text-xl font-bold text-white tracking-tight'>
              Customer Portal
            </h1>
            <span className='px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full shadow-sm'>
              Secure v2.4
            </span>
          </div>
          <p className='text-xs text-slate-400 font-medium flex items-center gap-2'>
            <span>ClaimStreams InsurTech Operations</span>
            <span className='text-slate-600'>•</span>
            <span className='text-slate-300'>
              Welcome back,{" "}
              <span className='text-indigo-400 font-semibold'>
                {user?.fullName || "Valued Customer"}
              </span>
            </span>
          </p>
        </div>
      </div>

      {/* Right: User Profile Control */}
      <div className='flex items-center gap-3 self-end md:self-center'>
        <ProfileBadge />
      </div>
    </header>
  );
}
