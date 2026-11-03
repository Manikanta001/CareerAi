import React, { useEffect, useState } from 'react';
import { performanceService } from '../../services/performanceService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { MessageSquareCode, CheckCircle2 } from 'lucide-react';

const InterviewPrep = () => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await performanceService.getInterviewQuestions(category);
        setQuestions(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load interview questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category]);

  if (loading) return <LoadingSpinner message="Loading technical & HR interview questions..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquareCode className="h-6 w-6 text-brand-400" /> Placement Interview Preparation
          </h1>
          <p className="text-xs text-slate-400">Curated Technical, HR, and Behavioral Q&A with model answers</p>
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
        >
          <option value="All">All Categories</option>
          <option value="Technical">Technical Q&A</option>
          <option value="HR">HR & Behavioral</option>
        </select>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{q.topic}</span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                {q.category}
              </span>
            </div>

            <h3 className="text-base font-bold text-white leading-relaxed">{q.question}</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">Model Answer:</span>
              {q.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPrep;
