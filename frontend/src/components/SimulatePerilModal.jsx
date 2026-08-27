import { useState } from "react";
import { Cpu, X, Zap } from "lucide-react";
import { toast } from "react-toastify";
import { getAllClaims, simulatePeril } from "../assets/services/apiCalls";

const SimulatePerilModal = ({ isOpen, onClose, setClaims }) => {
  const [count, setCount] = useState(1000);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericCount = Number(count);
    if (!numericCount || numericCount <= 0) {
      toast.error("Please enter a valid count greater than 0");
      return;
    }

    setIsSimulating(true);

    try {
      await simulatePeril(numericCount);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await getAllClaims();
      console.log(response)
      const updatedClaims = response.data;
      setClaims(updatedClaims);
      toast.success(
        `Triggered stream simulation for ${numericCount} peril events!`
      );
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data || "Failed to execute peril simulation stream."
      );
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4'>
      <div className='bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-800 pb-4 mb-4'>
          <div className='flex items-center gap-2.5'>
            <div className='p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400'>
              <Cpu className='w-5 h-5' />
            </div>
            <div>
              <h3 className='text-sm font-semibold text-slate-100'>
                Simulate Peril Events
              </h3>
              <p className='text-xs text-slate-400'>
                Inject mock events into the ingestion pipeline
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

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Number of Events
            </label>
            <input
              type='number'
              min='1'
              max='100'
              required
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder='e.g. 5'
              className='w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 transition-colors'
            />
          </div>

          {/* Action buttons */}
          <div className='flex gap-2 pt-3 border-t border-slate-800 mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSimulating}
              className='flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-all cursor-pointer shadow-sm shadow-amber-500/20 active:scale-95'>
              <Zap className='w-4 h-4 fill-current' />
              <span>{isSimulating ? "Simulating..." : "Simulate"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimulatePerilModal;
