/*
 * ChangePasswordButton Component
 * Why is it required? Provides an interactive button and modal form allowing users
 * flagged with default passwords to submit a compliant new password safely.
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CircleUser, LogOut, KeyRound } from "lucide-react";
import PasswordChangeModal from "./PasswordChangeModal";

const ProfileBadge = () => {
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const openPasswordModal = () => {
    setIsDropdownOpen(false);
    setIsPasswordChangeModalOpen(true);
  };

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
          <div className='absolute right-0 mt-2 w-50 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 py-1.5 divide-y divide-slate-800/60'>
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
        <PasswordChangeModal
          onClose={() => setIsPasswordChangeModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProfileBadge;
