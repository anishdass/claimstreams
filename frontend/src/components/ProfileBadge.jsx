/*
 * ChangePasswordButton Component
 * Why is it required? Provides an interactive button and modal form allowing users
 * flagged with default passwords to submit a compliant new password safely.
 */

import { useState } from "react";
import { loginCall, updatePassword } from "../assets/services/apiCalls";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Loader from "./CommonComponents/Loader";
import { CircleUser, LogOut, KeyRound } from "lucide-react";

const ProfileBadge = () => {
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, user, logout } = useAuth();

  const openPasswordModal = () => {
    setIsDropdownOpen(false);
    setIsPasswordChangeModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response1 = await updatePassword(oldPassword, newPassword);
      toast.success(response1.message);
      setIsPasswordChangeModalOpen(false);

      const response2 = await loginCall(user.email, newPassword);

      const updatedUser = response2.user;
      setUser(updatedUser);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "An error occurred",
      );
      setIsPasswordChangeModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 gap-2'>
        Updating password
        <Loader size={8} />
      </div>
    );
  }

  return (
    <>
      <div className='relative'>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup='menu'
          aria-expanded={isDropdownOpen}>
          <CircleUser className='w-6 h-6 inline-block cursor-pointer' />
        </button>

        {isDropdownOpen && (
          <div className='absolute right-0 mt-2 w-30 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 py-1.5 divide-y divide-slate-800/60'>
            {user?.isDefaultPassword && (
              <button
                type='button'
                onClick={openPasswordModal}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer'>
                <div className='items-center inline-flex gap-2 text-white'>
                  <KeyRound className='size-3.5 text-blue-500' />
                  Change Password
                </div>
              </button>
            )}
            <button
              type='button'
              onClick={logout}
              className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer'>
              <div className=' items-center inline-flex gap-2 text-white'>
                <LogOut className='size-3.5 text-red-500' />
                Logout
              </div>
            </button>
          </div>
        )}
      </div>

      {isPasswordChangeModalOpen && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200'>
          <div className='bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl'>
            <h3 className='text-lg font-semibold text-slate-100 mb-1'>
              Update Password
            </h3>
            <p className='text-xs text-slate-400 mb-5 leading-relaxed'>
              Please choose a new password between 8-16 characters containing
              upper, lower, numeric, and special characters.
            </p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-4'>
                {/* Old Password Row */}
                <div className='flex items-center justify-between gap-4'>
                  <label className='w-1/3 text-sm font-medium text-slate-300'>
                    Old Password
                  </label>
                  <input
                    type='password'
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className='w-2/3 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all'
                    placeholder='••••••••'
                    required
                  />
                </div>

                {/* New Password Row */}
                <div className='flex items-center justify-between gap-4'>
                  <label className='w-1/3 text-sm font-medium text-slate-300'>
                    New Password
                  </label>
                  <input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='w-2/3 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all'
                    placeholder='••••••••'
                    required
                  />
                </div>
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t border-slate-800/60'>
                <button
                  type='button'
                  onClick={() => setIsPasswordChangeModalOpen(false)}
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
      )}
    </>
  );
};

export default ProfileBadge;
