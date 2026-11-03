import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import ProgressBar from '../../components/ProgressBar';
import { Award, CheckCircle2, XCircle, AlertCircle, ArrowRight, Home } from 'lucide-react';

const TestResult = () => {
  const location = useLocation();
  const result = location.state?.result || {
    score: 36.5,
    percentage: 73.0,
    accuracy: 78.5,
    correct_answers: 39,
    wrong_answers: 8,
    skipped_questions: 3,
    time_taken_seconds: 2450,
    subject_breakdown: {
      "Quantitative Aptitude": 80,
      "Logical Reasoning": 65,
      "Verbal Ability": 85,
      "Programming": 70,
      "DBMS": 50
    },
    weak_topics: ["SQL Joins", "Normalization", "Dynamic Programming"]
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Award className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Test Evaluation Complete!</h1>
        <div className="text-4xl font-extrabold text-emerald-400">{result.percentage}%</div>
        <p className="text-xs text-slate-400">Total Score: {result.score} (Accuracy: {result.accuracy}%)</p>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Correct Answers" value={result.correct_answers} subtitle="+1 Mark each" icon={CheckCircle2} color="emerald" />
        <StatCard title="Wrong Answers" value={result.wrong_answers} subtitle="-0.25 Negative deduction" icon={XCircle} color="rose" />
        <StatCard title="Skipped Questions" value={result.skipped_questions} subtitle="0 Marks deducted" icon={AlertCircle} color="amber" />
      </div>

      {/* Subject Performance Breakdown */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-white">Subject-wise Accuracy Breakdown</h3>
        <div className="space-y-3 pt-2">
          {Object.entries(result.subject_breakdown || {}).map(([subj, pct], idx) => (
            <ProgressBar key={idx} label={subj} value={pct} color={pct >= 70 ? 'emerald' : 'amber'} />
          ))}
        </div>
      </div>

      {/* Automatically Identified Weak Areas */}
      {result.weak_topics?.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" /> Automatically Identified Weak Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.weak_topics.map((top, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs">
                {top}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 pt-4">
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2"
        >
          <Home className="h-4 w-4" /> Return to Dashboard
        </Link>
        <Link
          to="/mcq-practice"
          className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 flex items-center gap-2"
        >
          Practice Weak Topics <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default TestResult;
