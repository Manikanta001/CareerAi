import React, { useEffect, useState } from 'react';
import { performanceService } from '../../services/performanceService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatCard from '../../components/StatCard';
import ProgressBar from '../../components/ProgressBar';
import { LineChart, Award, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Performance = () => {
  const [perf, setPerf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        setLoading(true);
        const res = await performanceService.getPerformance();
        setPerf(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load performance analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchPerf();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating performance diagnostics..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <LineChart className="h-6 w-6 text-brand-400" /> Performance Analytics & Weak Area Diagnostics
        </h1>
        <p className="text-xs text-slate-400">Detailed accuracy tracking across subjects and practice sessions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Placement Readiness" value={`${perf?.career_readiness_score}%`} subtitle="Combined weighted score" icon={Award} color="emerald" />
        <StatCard title="Overall Accuracy" value={`${perf?.overall_accuracy}%`} subtitle="Across all attempted questions" icon={TrendingUp} color="brand" />
        <StatCard title="Mock Tests Attempted" value={perf?.total_tests_taken || 3} subtitle="Submitted mock sessions" icon={LineChart} color="indigo" />
      </div>

      {/* Score Trend Chart */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-white">Placement Readiness Progress Trend</h3>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={perf?.score_trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fill="#10b98120" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white">Subject Mastery Level</h3>
        <div className="space-y-3">
          {Object.entries(perf?.subject_performance || {}).map(([subj, pct], idx) => (
            <ProgressBar key={idx} label={subj} value={pct} color={pct >= 70 ? 'emerald' : 'amber'} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;
