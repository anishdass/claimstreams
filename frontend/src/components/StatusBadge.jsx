const renderStatusBadge = (status) => {
    switch (status) {
      case "AUTO_APPROVED":
        return (
          <span className='bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
            🟢 Auto Approved
          </span>
        );
      case "MANUAL_REVIEW":
        return (
          <span className='bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
            ⚠️ Manual Review
          </span>
        );
      case "HIGH_VALUE_AUDIT":
        return (
          <span className='bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
            🔍 High Value Audit
          </span>
        );
      case "SLA_BREACH_ESCALATED":
        return (
          <span className='bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full font-medium animate-pulse'>
            🚨 SLA Breach
          </span>
        );
      case "SENIOR_APPROVED":
        return (
          <span className='bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
            👤 Senior Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className='bg-slate-700 text-slate-400 border border-slate-600 text-xs px-2.5 py-1 rounded-full font-medium'>
            🚫 Rejected
          </span>
        );
      default:
        return null;
    }
  };

  export default renderStatusBadge