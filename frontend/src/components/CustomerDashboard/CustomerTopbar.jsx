import { useAuth } from "../../context/AuthContext";
import ChangePasswordButton from "../ChangePasswordButton";
import LogoutButton from "../CommonComponents/LogoutButton";

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
        <LogoutButton logout={logout} />
        {user.isDefaultPassword && <ChangePasswordButton user={user} />}
      </div>
    </header>
  );
}
