import { useAuth } from "../../context/AuthContext";

export function CustomerTopbar({ user }) {
  const { logout } = useAuth();

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
        <button
          type='button'
          onClick={logout}
          className='px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 hover:border-rose-500/40 transition-all active:scale-95 cursor-pointer'>
          Logout
        </button>
      </div>
    </header>
  );
}
