import React from 'react';

const ProgressBar = ({ value = 0, max = 100, label, showValue = true, size = 'md', color = 'brand' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorMap = {
    brand: 'bg-gradient-to-r from-brand-600 to-indigo-500',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-400',
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    rose: 'bg-gradient-to-r from-rose-600 to-pink-500'
  };

  return (
    <div className="w-full space-y-1.5">
      {(label || showValue) && (
        <div className="flex justify-between text-xs font-semibold">
          {label && <span className="text-slate-300">{label}</span>}
          {showValue && <span className="text-slate-400">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heightMap[size]}`}>
        <div
          className={`${heightMap[size]} ${colorMap[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
