import { useState } from "react";
import { loginCall, updatePassword } from "../assets/services/apiCalls";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Loader from "./CommonComponents/Loader";
import { Eye, EyeOff } from "lucide-react";

const PasswordChangeModal = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response1 = await updatePassword(oldPassword, newPassword);
      toast.success(response1.message);

      const response2 = await loginCall(user.email, newPassword);
      setUser(response2.user);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center gap-2 bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200'>
        Updating password
        <Loader size={8} />
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200'>
      <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl'>
        <h3 className='text-lg font-semibold text-slate-100 mb-1'>
          Update Password
        </h3>
        <p className='text-xs text-slate-400 mb-5 leading-relaxed'>
          Please choose a new password between 8-16 characters containing upper,
          lower, numeric, and special characters.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-4'>
            {/* Old Password Row */}
            <div className='flex items-center justify-between gap-4'>
              <label className='w-1/3 text-sm font-medium text-slate-300'>
                Old Password
              </label>
              <div className='relative w-2/3'>
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className='w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all'
                  placeholder='••••••••'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowOldPassword((visible) => !visible)}
                  className='absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 transition-colors hover:text-slate-200 cursor-pointer'
                  aria-label={
                    showOldPassword ? "Hide old password" : "Show old password"
                  }
                  title={
                    showOldPassword ? "Hide old password" : "Show old password"
                  }>
                  {showOldPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            {/* New Password Row */}
            <div className='flex items-center justify-between gap-4'>
              <label className='w-1/3 text-sm font-medium text-slate-300'>
                New Password
              </label>
              <div className='relative w-2/3'>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all'
                  placeholder='••••••••'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword((visible) => !visible)}
                  className='absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 transition-colors hover:text-slate-200 cursor-pointer'
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                  title={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }>
                  {showNewPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t border-slate-800/60'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50'
              disabled={loading}>
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
              {loading ? "Saving..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
