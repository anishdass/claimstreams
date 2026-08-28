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
