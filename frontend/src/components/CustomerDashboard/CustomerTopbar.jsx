import { SquareUser } from "lucide-react";

import ProfileBadge from "../ProfileBadge";

export function CustomerTopbar({ user }) {
  return (
    <header className='mb-6 flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between'>
      <div className='min-w-0'>
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
          <div className='ml-2 flex items-center gap-2'>
            <div className='relative shrink-0 rounded-xl border border-indigo-500/30 bg-linear-to-br from-indigo-500/20 to-purple-500/10 p-3 text-indigo-400 shadow-lg shadow-indigo-500/5'>
              <SquareUser className='h-7 w-7' />

              <span className='absolute -right-1 -top-1 flex h-2.5 w-2.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
                <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500'></span>
              </span>
            </div>

            <h1 className='text-xl font-bold tracking-tight text-white'>
              Customer Portal
            </h1>
          </div>
        </div>

        <div className='ml-0'>
          <p className='mt-1 flex flex-wrap items-center text-xs font-medium text-slate-400'>
            <span className='text-slate-500'>
              Welcome back,{" "}
              <span className='font-medium text-indigo-400'>
                {user?.fullName || "Valued Customer"}
              </span>
            </span>
            <span className='mx-2 text-slate-600' aria-hidden='true'>
              •
            </span>
            Manage your policies, coverage, and claims in one place.
          </p>
        </div>
      </div>

      <div className='flex items-center gap-3 self-end sm:self-auto'>
        <ProfileBadge />
      </div>
    </header>
  );
}
