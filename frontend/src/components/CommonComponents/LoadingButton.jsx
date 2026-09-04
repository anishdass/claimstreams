import { Loader2 } from "lucide-react";

export const LoadingButton = ({ isLoading, children }) => {
  return (
    <button
      disabled={isLoading}
      className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50'>
      {isLoading ? (
        <>
          <Loader2 className='w-4 h-4 animate-spin text-white' />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
