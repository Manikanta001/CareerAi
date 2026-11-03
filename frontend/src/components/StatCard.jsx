import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'brand' }) => {
  const colorMap = {
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  };

  return (
    <div className="glass-panel p-5 rounded-2xl glass-panel-hover flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.brand}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
            <span>↑</span> {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
