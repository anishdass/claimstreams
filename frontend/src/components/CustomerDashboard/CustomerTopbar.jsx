export function CustomerTopbar({ user }) {
  return (
    <header className='flex items-center justify-between pb-6 border-b border-slate-800 mb-6'>
      <div>
        <h1 className='text-xl font-bold text-white tracking-tight'>
          Customer Portal
        </h1>
        <p className='text-xs text-slate-400 mt-1'>
          Welcome back,{" "}
          <span className='text-indigo-400 font-medium'>
            {user?.fullName || "Valued Customer"}
          </span>
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <span className='px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold'>
          Account Active
        </span>
      </div>
    </header>
  );
}
