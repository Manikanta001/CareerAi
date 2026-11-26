import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { performanceService } from '../../services/performanceService';
import { jobService } from '../../services/jobService';
import { resumeService } from '../../services/resumeService';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { 
  Award, FileText, AlertCircle,
  ArrowRight, BookOpen, Briefcase, Calendar, Sparkles, TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [perf, setPerf] = useState(null);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [learningProgress, setLearningProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeStatus, setResumeStatus] = useState(null);

  useEffect(() => {
    resumeService.getOnboardingStatus()
      .then((res) => setResumeStatus(res || null))
      .catch(() => setResumeStatus(null));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.allSettled([
      performanceService.getPerformance(),
      performanceService.getDailyPlan(),
      jobService.getRecommendedJobs(),
      resumeService.getLearningProgress()
    ]);
    setPerf(results[0].status === 'fulfilled' ? results[0].value : null);
    setDailyPlan(results[1].status === 'fulfilled' ? results[1].value : null);
    setJobs(results[2].status === 'fulfilled' ? (results[2].value || []).slice(0, 2) : []);
    setLearningProgress(results[3].status === 'fulfilled' ? results[3].value : null);
    const failures = results.filter((result) => result.status === 'rejected');
    if (failures.length) setError(failures[0].reason?.message || 'Some dashboard information could not be loaded.');
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <LoadingSpinner message="Calculating career readiness score..." />;

  const readinessScore = perf?.career_readiness_score;

  return (
    <div className="space-y-8">
      {error && <ErrorMessage message={error} onRetry={fetchData} />}
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Career Goal: {user?.preferred_career || 'Software Developer'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              {readinessScore == null
                ? 'Complete a mock assessment to establish your readiness baseline. Add your profile skills to get more useful role matches.'
                : 'Your score reflects your recorded mock test performance. Review your action plan and focus areas to keep improving.'}
            </p>
          </div>

          {/* Circular Readiness Gauge */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="relative h-20 w-20 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-500"
                  strokeDasharray={`${readinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xl font-extrabold text-white">{readinessScore == null ? '—' : `${readinessScore}%`}</span>
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Readiness Score</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">{readinessScore == null ? 'Complete an assessment' : 'Based on recorded activity'}</div>
            </div>
          </div>
        </div>
      </div>

      {resumeStatus && !resumeStatus.has_resume && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-amber-100">Make your study plan personal</h2>
            <p className="mt-1 text-xs text-amber-100/70">Add a resume to see skills detected and get more relevant topics to study.</p>
          </div>
          <Link to="/resume-analyzer" className="inline-flex items-center gap-2 self-start rounded-lg bg-amber-500/15 px-4 py-2 text-xs font-bold text-amber-200 hover:bg-amber-500/25 sm:self-auto">
            Add resume <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Resume Score" value={perf?.resume_score != null ? `${perf.resume_score}/100` : 'Not added'} subtitle={perf?.resume_score != null ? 'Based on your uploaded resume' : 'Upload a resume to get a score'} icon={FileText} color="brand" />
        <StatCard title="Placement Test Avg" value={perf?.placement_test_score == null ? 'Not attempted' : `${perf.placement_test_score}%`} subtitle={perf?.total_tests_taken ? `Across ${perf.total_tests_taken} attempt${perf.total_tests_taken === 1 ? '' : 's'}` : 'Take a mock test to begin'} icon={Award} color="emerald" />
        <StatCard title="Learning Plan" value={learningProgress?.total_skills ? `${Math.round((learningProgress.completed_skills.length / learningProgress.total_skills) * 100)}%` : 'Not started'} subtitle={learningProgress?.total_skills ? `${learningProgress.completed_skills.length} of ${learningProgress.total_skills} skills complete` : 'Upload a resume to create a plan'} icon={BookOpen} color="indigo" />
        <StatCard title="Questions Solved" value={perf?.total_questions_solved ?? 0} subtitle={perf?.overall_accuracy == null ? 'No scored questions yet' : `Accuracy: ${perf.overall_accuracy}%`} icon={TrendingUp} color="cyan" />
      </div>

      {/* Main Grid: Chart & Today's Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness & Performance Trend Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Score Trend & Analytics</h3>
              <p className="text-xs text-slate-400">Mock test performance over time</p>
            </div>
            <Link to="/performance" className="text-xs font-semibold text-brand-400 hover:underline flex items-center gap-1">
              Full Diagnostics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full pt-4">
            {perf?.score_trend?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perf?.score_trend || []}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: '#172033', borderColor: '#cbd5e1', borderRadius: '12px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)' }} />
                <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
            ) : <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-700 text-center text-xs text-slate-400">Take a mock test to build your performance trend.</div>}
          </div>
        </div>

        {/* Today's Daily Plan */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-400" />
                <h3 className="text-base font-bold text-white">Today's Action Plan</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                {dailyPlan?.estimated_total_time || 'Plan unavailable'}
              </span>
            </div>

            <div className="space-y-3 pt-4">
              {dailyPlan?.tasks?.length ? dailyPlan.tasks.map((task) => (
                <div key={task.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-brand-400" />
                    <span className="text-slate-200 font-medium">{task.title}</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-400 font-mono">{task.duration}</span>
                </div>
              )) : <p className="text-xs text-slate-400">Your action plan is not available right now.</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              to="/mcq-practice"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              Start Practice Session <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Weak Topics & Recommended Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weak Subjects Diagnostic */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" /> Weak Topics to Focus On
            </h3>
            <Link to="/skill-gap" className="text-xs font-semibold text-brand-400 hover:underline">
              Analyze Gaps
            </Link>
          </div>

          <div className="space-y-3">
            {perf?.weak_topics?.length ? perf.weak_topics.map((topic, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
                <span className="font-semibold">{topic}</span>
                <Link to="/mcq-practice" className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition-colors">
                  Practice Now
                </Link>
              </div>
            )) : <p className="text-xs text-slate-400">Complete a test to identify topics that need improvement.</p>}
          </div>
        </div>

        {/* Matching Jobs Preview */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-emerald-400" /> Top Matched Jobs
            </h3>
            <Link to="/jobs" className="text-xs font-semibold text-brand-400 hover:underline">
              View All Jobs
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{job.title}</h4>
                  <p className="text-xs text-slate-400">{job.company} • {job.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-400">
                    {job.match_percentage == null ? 'Not assessed' : `${job.match_percentage}% Match`}
                  </span>
                <Link to={`/jobs/${job.id}`} className="block text-[10px] text-brand-400 hover:underline mt-0.5">View role</Link>
                </div>
              </div>
            ))}
            {!jobs.length && <p className="text-xs text-slate-400">No matched roles are available yet. Add skills to your profile to improve your matches.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
