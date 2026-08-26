import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

const renderStatusBadge = (status) => {
  switch (status) {
    case "SUBMITTED":
      return (
        <span className='inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
          <Clock className='w-3.5 h-3.5 text-sky-400' />
          <span>Submitted</span>
        </span>
      );

    case "MANUAL_REVIEW":
      return (
        <span className='inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
          <AlertTriangle className='w-3.5 h-3.5 text-amber-400' />
          <span>Manual Review</span>
        </span>
      );

    case "AUTO_APPROVED":
    case "APPROVED":
      return (
        <span className='inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
          <CheckCircle2 className='w-3.5 h-3.5 text-emerald-400' />
          <span>Approved</span>
        </span>
      );

    case "REJECTED":
      return (
        <span className='inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full font-medium'>
          <XCircle className='w-3.5 h-3.5 text-rose-400' />
          <span>Rejected</span>
        </span>
      );
    default:
      return null;
  }
};

export default renderStatusBadge;
