import { useState } from "react";
import { X, UserPlus, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { registerUser } from "../assets/services/apiCalls";

export default function RegisterModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "ROLE_ADJUSTER",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await registerUser(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      );
      toast.success(
        response?.data?.message || "Account registered successfully!"
      );

      // Reset form state on successful submission
      setFormData({
        email: "",
        password: "",
        fullName: "",
        role: "ROLE_ADJUSTER",
      });

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4'>
      <div className='bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-800 pb-4 mb-4'>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400'>
              <UserPlus className='w-5 h-5' />
            </div>
            <div>
              <h3 className='text-sm font-semibold text-slate-100'>
                Create an Account
              </h3>
              <p className='text-xs text-slate-400'>
                Enter details to register a new user identity
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer'>
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Full Name */}
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Full Name
            </label>
            <div className='relative'>
              <User className='w-4 h-4 text-slate-500 absolute left-3 top-2.5' />
              <input
                type='text'
                name='fullName'
                required
                placeholder='e.g. Alice Smith'
                value={formData.fullName}
                onChange={handleInputChange}
                className='w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors'
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Email Address
            </label>
            <div className='relative'>
              <Mail className='w-4 h-4 text-slate-500 absolute left-3 top-2.5' />
              <input
                type='email'
                name='email'
                required
                placeholder='alice@example.com'
                value={formData.email}
                onChange={handleInputChange}
                className='w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors'
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Password
            </label>
            <div className='relative'>
              <Lock className='w-4 h-4 text-slate-500 absolute left-3 top-2.5' />
              <input
                type='password'
                name='password'
                required
                placeholder='••••••••'
                value={formData.password}
                onChange={handleInputChange}
                className='w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors'
              />
            </div>
          </div>

          {/* User Role Selection */}
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Account Role
            </label>
            <div className='relative'>
              <ShieldCheck className='w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none' />
              <select
                name='role'
                value={formData.role}
                onChange={handleInputChange}
                className='w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none'>
                <option value='ROLE_ADJUSTER'>Adjuster</option>
                <option value='ROLE_SENIOR_ADJUSTER'>Senior Adjuster</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className='flex gap-2 pt-3 border-t border-slate-800 mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer'>
              {isSubmitting ? "Registering..." : "Register User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
