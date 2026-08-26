import { useState, useEffect } from "react";
import { X, ShieldPlus } from "lucide-react";
import { toast } from "react-toastify";
import { createPolicy, fetchUpdatedPerils } from "../assets/services/apiCalls";

export default function CreatePolicyModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    policyHolderEmail: "",
    policyHolderName: "",
    coveredPeril: [],
    maxCoverageLimit: "",
    deductible: "",
  });

  const [availablePerils, setAvailablePerils] = useState([]);
  const [loadingPerils, setLoadingPerils] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch updated perils from backend whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const loadPerils = async () => {
        setLoadingPerils(true);
        try {
          const res = await fetchUpdatedPerils();
          const perilsList = Array.isArray(res) ? res : res?.data || [];
          setAvailablePerils(perilsList);
        } catch (error) {
          console.log(error?.response?.data);

          toast.error("Failed to load available perils from backend");
        } finally {
          setLoadingPerils(false);
        }
      };
      loadPerils();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles multi-select checkbox updates for covered perils
  const handlePerilToggle = (peril) => {
    setFormData((prev) => {
      const exists = prev.coveredPeril.includes(peril);
      if (exists) {
        return {
          ...prev,
          coveredPeril: prev.coveredPeril.filter((p) => p !== peril),
        };
      } else {
        return { ...prev, coveredPeril: [...prev.coveredPeril, peril] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation Guard
    if (Number(formData.deductible) > Number(formData.maxCoverageLimit)) {
      toast.error("Deductible cannot be greater than maximum coverage limit!");
      return;
    }

    if (formData.coveredPeril.length === 0) {
      toast.error("Please select at least one covered peril.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createPolicy(
        formData.policyHolderEmail,
        formData.policyHolderName,
        formData.coveredPeril,
        formData.maxCoverageLimit,
        formData.deductible
      );
      toast.success(response?.data?.message || "Policy Created Successfully!");
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create policy");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4'>
      <div className='bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-800 pb-4 mb-4'>
          <div className='flex items-center gap-2'>
            <div className='p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400'>
              <ShieldPlus className='w-5 h-5' />
            </div>
            <div>
              <h3 className='text-sm font-semibold text-slate-100'>
                Issue New Insurance Policy
              </h3>
              <p className='text-xs text-slate-400'>
                Define policyholder terms and covered risk hazards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors'>
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Policyholder Name
            </label>
            <input
              type='text'
              name='policyHolderName'
              required
              placeholder='e.g. John Doe'
              value={formData.policyHolderName}
              onChange={handleInputChange}
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Policyholder Email
            </label>
            <input
              type='email'
              name='policyHolderEmail'
              required
              placeholder='john.doe@example.com'
              value={formData.policyHolderEmail}
              onChange={handleInputChange}
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors'
            />
          </div>

          {/* Dynamic Multi-Select Perils list */}
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Covered Perils (Select Multiple)
            </label>
            {loadingPerils ? (
              <div className='text-xs text-slate-500 py-2'>
                Fetching available perils...
              </div>
            ) : (
              <div className='max-h-32 overflow-y-auto bg-slate-950 border border-slate-800 rounded-lg p-2 space-y-1.5 custom-scrollbar'>
                {availablePerils.length === 0 ? (
                  <span className='text-xs text-slate-500'>
                    No perils available.
                  </span>
                ) : (
                  availablePerils.map((peril) => (
                    <label
                      key={peril}
                      className='flex items-center gap-2 text-xs text-slate-300 hover:bg-slate-900 p-1.5 rounded cursor-pointer transition-colors'>
                      <input
                        type='checkbox'
                        checked={formData.coveredPeril.includes(peril)}
                        onChange={() => handlePerilToggle(peril)}
                        className='rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500'
                      />
                      <span>{peril}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>
                Max Coverage Limit (£)
              </label>
              <input
                type='number'
                name='maxCoverageLimit'
                required
                min='0'
                placeholder='0.00'
                value={formData.maxCoverageLimit}
                onChange={handleInputChange}
                className='w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500 transition-colors'
              />
            </div>

            <div>
              <label className='block text-xs font-medium text-slate-300 mb-1'>
                Policy Deductible (£)
              </label>
              <input
                type='number'
                name='deductible'
                required
                min='0'
                placeholder='0.00'
                value={formData.deductible}
                onChange={handleInputChange}
                className='w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500 transition-colors'
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className='flex gap-2 pt-3 border-t border-slate-800 mt-4'>
            <button
              type='button'
              //   onClick={onClose}
              className='flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer'>
              {isSubmitting ? "Creating..." : "Create Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
