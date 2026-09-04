import { useEffect, useState } from "react";
import { getClaimsMetrics } from "../../assets/services/apiCalls";
import { toast } from "react-toastify";
import { LoadingButton } from "../CommonComponents/LoadingButton";

const MetricCard = ({claimsMetrics, setClaimsMetrics}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMetricData = async () => {
      try {
        setIsLoading(true);
        const response = await getClaimsMetrics();
        setClaimsMetrics(response);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "An unexpected error occured",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetricData();
  }, []);

  if (isLoading) {
    return <LoadingButton />;
  }
  const totalSubmitted = claimsMetrics?.totalClaims;

  const autoApprovedCount = claimsMetrics?.approvedClaims;

  const stpRate = totalSubmitted
    ? ((autoApprovedCount / totalSubmitted) * 100).toFixed(1)
    : 0;
  const pendingManualCount = claimsMetrics?.pendingClaims;

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        {/* Total Claims Card */}
        <div className='bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-sm'>
          <span className='text-xs text-slate-400 font-medium tracking-wide'>
            Total Ingested Claims
          </span>
          <p className='text-2xl font-bold text-slate-100 mt-2 font-mono'>
            {totalSubmitted}
          </p>
        </div>
        {/* STP Rate Card */}
        <div className='bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-sm'>
          <span className='text-xs text-slate-400 font-medium tracking-wide'>
            Straight-Through Processing Rate
          </span>
          <p className='text-2xl font-bold text-emerald-400 mt-2 font-mono'>
            {stpRate}%
          </p>
        </div>
        {/* Pending Queue Card */}
        <div className='bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-sm'>
          <span className='text-xs text-slate-400 font-medium tracking-wide'>
            Pending Manual Queue
          </span>
          <p className='text-2xl font-bold text-amber-400 mt-2 font-mono'>
            {pendingManualCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
