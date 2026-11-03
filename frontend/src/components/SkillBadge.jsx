import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const SkillBadge = ({ skill, status = 'default', onRemove }) => {
  const statusStyles = {
    default: 'bg-slate-800 text-slate-200 border-slate-700',
    Strong: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    Moderate: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    'Needs Improvement': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    Missing: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
  };

  const statusIcons = {
    Strong: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    Moderate: <AlertCircle className="h-3.5 w-3.5 text-amber-400" />,
    'Needs Improvement': <AlertCircle className="h-3.5 w-3.5 text-amber-400" />,
    Missing: <XCircle className="h-3.5 w-3.5 text-rose-400" />
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${statusStyles[status] || statusStyles.default} transition-all`}>
      {statusIcons[status]}
      <span>{skill}</span>
      {onRemove && (
        <button onClick={onRemove} className="ml-1 text-slate-400 hover:text-white">
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
