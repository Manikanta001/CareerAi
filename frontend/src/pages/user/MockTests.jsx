import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { testService } from '../../services/testService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { FileQuestion, Clock, CheckCircle2, Play } from 'lucide-react';

const MockTests = () => {
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [testsRes, attemptsRes] = await Promise.all([
          testService.getMockTests(),
          testService.getAttemptHistory()
        ]);
        setTests(testsRes.data || []);
        setAttempts(attemptsRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load mock tests');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading placement mock test suite..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileQuestion className="h-6 w-6 text-brand-400" /> Placement Mock Tests
        </h1>
        <p className="text-xs text-slate-400">Timed placement screening assessments with negative marking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test) => (
          <div key={test.id} className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between glass-panel-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                  Full Placement Test
                </span>
                <span className="flex items-center gap-1 text-xs font-mono font-bold text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> {test.duration_minutes} mins
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{test.title}</h3>

              <div className="space-y-1.5 pt-2">
                {test.sections?.map((sec, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-400">
                    <span>{sec.name}</span>
                    <span className="font-semibold text-slate-300">{sec.count} Qs</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Negative Mark: -0.25</span>
              <Link
                to={`/mock-tests/${test.id}`}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5" /> Start Test Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Attempt History */}
      {attempts.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white">Recent Test Attempt History</h3>
          <div className="space-y-3">
            {attempts.map((att, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Placement Test Attempt #{idx + 1}</div>
                  <div className="text-slate-400">Submitted: {att.submitted_at}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Score</div>
                    <div className="font-extrabold text-emerald-400 text-sm">{att.percentage}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Accuracy</div>
                    <div className="font-bold text-brand-400 text-sm">{att.accuracy}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTests;
