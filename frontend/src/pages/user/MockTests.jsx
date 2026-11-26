import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { testService } from '../../services/testService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { FileQuestion, Clock, CheckCircle2, Play } from 'lucide-react';

const MockTests = () => {
  const [searchParams] = useSearchParams();
  const companySlug = searchParams.get('company');
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
        setTests(testsRes || []);
        setAttempts(attemptsRes || []);
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

  const companyNames = { tcs: 'TCS', infosys: 'Infosys', accenture: 'Accenture', wipro: 'Wipro', cognizant: 'Cognizant' };
  const visibleTests = companySlug ? tests.filter((test) => test.company_slug === companySlug) : tests;
  const visibleAttempts = companySlug ? attempts.filter((attempt) => attempt.test_id === `company-${companySlug}`) : attempts;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileQuestion className="h-6 w-6 text-brand-400" /> {companySlug ? `${companyNames[companySlug] || companySlug} Practice Mock` : 'Placement Mock Tests'}
        </h1>
        <p className="text-xs text-slate-400">{companySlug ? 'A separate, shortened pattern-aligned practice set. It is not an official full-length assessment.' : 'Timed placement screening assessments with negative marking'}</p>
        {companySlug && <Link to={`/company-prep/${companySlug}`} className="mt-2 inline-flex text-xs font-bold text-brand-600 hover:text-brand-700">Back to {companyNames[companySlug] || companySlug} preparation</Link>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleTests.map((test) => (
          <div key={test.id} className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between glass-panel-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                  {test.test_type || 'Full Placement Test'}
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
              <span className="text-[11px] text-slate-400">{test.company ? `${test.total_questions} questions · no negative marking` : `Negative Mark: -${test.negative_marking ?? 0.25}`}</span>
              <Link
                to={`/mock-tests/${test.id}`}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5" /> Start Test Now
              </Link>
            </div>
          </div>
        ))}
        {!visibleTests.length && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No separate mock is available for this company yet.</div>}
      </div>

      {/* Attempt History */}
      {visibleAttempts.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white">Recent Test Attempt History</h3>
          <div className="space-y-3">
            {visibleAttempts.map((att, idx) => (
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
