const MetricCard = ({ claims }) => {
  const totalSubmitted = claims.length;

  const autoApprovedCount = claims.filter(
    (c) => c.status === "AUTO_APPROVED"
  ).length;

  const stpRate = totalSubmitted
    ? ((autoApprovedCount / totalSubmitted) * 100).toFixed(1)
    : 0;

  const pendingManualCount = claims.filter(
    (c) => c.status === "MANUAL_REVIEW" || c.status === "SUBMITTED"
  ).length;

  const totalPayout = claims.reduce((acc, curr) => acc + (curr.payout || 0), 0);

  return (
    <div>
      <div className='grid grid-cols-4 gap-4 mb-6'>
        <div className='bg-slate-900 border border-slate-800 p-4 rounded-xl'>
          <span className='text-xs text-slate-400 font-medium'>
            Total Ingested Claims
          </span>
          <p className='text-2xl font-bold text-slate-100 mt-1'>
            {totalSubmitted}
          </p>
        </div>
        <div className='bg-slate-900 border border-slate-800 p-4 rounded-xl'>
          <span className='text-xs text-slate-400 font-medium'>
            Straight-Through Processing Rate
          </span>
          <p className='text-2xl font-bold text-emerald-400 mt-1'>{stpRate}%</p>
        </div>
        <div className='bg-slate-900 border border-slate-800 p-4 rounded-xl'>
          <span className='text-xs text-slate-400 font-medium'>
            Pending Manual Queue
          </span>
          <p className='text-2xl font-bold text-amber-400 mt-1'>
            {pendingManualCount}
          </p>
        </div>
        <div className='bg-slate-900 border border-slate-800 p-4 rounded-xl'>
          <span className='text-xs text-slate-400 font-medium'>
            Total Settled Payouts
          </span>
          <p className='text-2xl font-bold text-indigo-400 mt-1'>
            £{totalPayout.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
