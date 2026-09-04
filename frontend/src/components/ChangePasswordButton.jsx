/*
 * ChangePasswordButton Component
 * Why is it required? Provides an interactive button and modal form allowing users
 * flagged with default passwords to submit a compliant new password safely.
 */

import { useState } from "react";
import { loginCall, updatePassword } from "../assets/services/apiCalls";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ChangePasswordButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response1 = await updatePassword(oldPassword, newPassword);
      toast.success(response1.message);
      setIsOpen(false);

      const response2 = await loginCall(user.email, newPassword);

      const updatedUser = response2.user;
      setUser(updatedUser);
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='bg-indigo-500 hover:bg-indigo-700 text-white text-xs font-light px-2 py-1 rounded-full transition-colors hover:cursor-pointer'>
        Change Password
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-indigo-900 rounded-lg p-6 max-w-md w-full shadow-xl'>
            <h3 className='text-lg font-semibold text-black mb-2'>
              Update Password
            </h3>
            <p className='text-sm text-black mb-4'>
              Please choose a new password between 8-16 characters containing
              upper, lower, numeric, and special characters.
            </p>

            <form onSubmit={handleSubmit} className='space-y-4 mt-2'>
              <div className='space-y-4'>
                {/* Old Password Row */}
                <div className='flex items-center justify-between gap-4'>
                  <label className='w-1/3 text-sm font-medium text-black'>
                    Old Password
                  </label>
                  <input
                    type='password'
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className='w-2/3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black'
                    required
                  />
                </div>

                {/* New Password Row */}
                <div className='flex items-center justify-between gap-4'>
                  <label className='w-1/3 text-sm font-medium text-black'>
                    New Password
                  </label>
                  <input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='w-2/3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black'
                    required
                  />
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-2'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='px-2 py-2 font-medium text-white bg-red-400 hover:bg-red-500 rounded-full hover:cursor-pointer'
                  disabled={loading}>
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full disabled:opacity-50 hover:cursor-pointer'>
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

export default ChangePasswordButton;
