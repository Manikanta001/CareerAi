import React, { useEffect, useState } from 'react';
import { performanceService } from '../../services/performanceService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { MessageSquareCode, Search } from 'lucide-react';

const InterviewPrep = () => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await performanceService.getInterviewQuestions(category);
        setQuestions(res || []);
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

  const visibleQuestions = questions.filter((question) =>
    `${question.topic} ${question.category} ${question.question}`.toLowerCase().includes(search.trim().toLowerCase())
  );

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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="interview-question-search" className="sr-only">Search interview questions</label>
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input id="interview-question-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search questions or topics" className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15" />
        </div>
        <p className="text-xs text-slate-500">Showing {visibleQuestions.length} of {questions.length} questions</p>
      </div>

      <div className="space-y-4">
        {visibleQuestions.map((q) => (
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
        {!visibleQuestions.length && <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{search ? 'No questions match your search in this category.' : 'No questions are available for this category yet.'}</p>}
      </div>
    </div>
  );
};

export default InterviewPrep;
