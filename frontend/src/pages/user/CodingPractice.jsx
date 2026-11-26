import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, Eye, Lightbulb, Search, Target } from 'lucide-react';
import { performanceService } from '../../services/performanceService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const CodingPractice = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const result = await performanceService.getCodingProblems();
        setProblems(result || []);
        setSelectedProblem(result?.[0] || null);
      } catch (err) {
        setError(err.message || 'Failed to load coding questions');
      } finally {
        setLoading(false);
      }
    };
    loadProblems();
  }, []);

  const filteredProblems = useMemo(() => problems.filter((problem) => {
    const matchesSearch = `${problem.title} ${problem.category}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (difficulty === 'All' || problem.difficulty === difficulty);
  }), [problems, search, difficulty]);

  if (loading) return <LoadingSpinner message="Loading coding questions..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm shadow-blue-100 md:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-300"><BookOpen className="h-3.5 w-3.5" /> DSA practice library</div>
            <h1 className="text-3xl font-black tracking-tight text-white">Coding Questions</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Study the pattern, understand the examples, then open a distraction-free editor when you are ready to solve.</p>
          </div>
          <Link to="/code-editor" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-400"><Code2 className="h-4 w-4" /> Open Code Editor <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="glass-panel rounded-2xl p-4">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500" htmlFor="question-search">Find a question</label>
            <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" /><input id="question-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or topic" className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white outline-none transition focus:border-brand-500" /></div>
            <div className="mt-3 flex gap-2">{['All', 'Easy', 'Medium'].map((level) => <button key={level} type="button" onClick={() => setDifficulty(level)} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${difficulty === level ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{level}</button>)}</div>
          </div>
          <div className="space-y-2">
            {filteredProblems.map((problem) => <button key={problem.id} type="button" onClick={() => { setSelectedProblem(problem); setShowExplanation(false); }} className={`w-full rounded-2xl border p-4 text-left transition ${selectedProblem?.id === problem.id ? 'border-brand-500/60 bg-brand-500/10 shadow-lg shadow-brand-950/30' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'}`}><div className="mb-2 flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">{problem.category}</span><span className={`rounded-md px-2 py-1 text-[10px] font-bold ${problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{problem.difficulty}</span></div><div className="text-sm font-bold text-white">{problem.title}</div></button>)}
            {!filteredProblems.length && <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-center text-xs text-slate-500">No questions match your search.</div>}
          </div>
        </aside>

        {selectedProblem && <article className="glass-panel rounded-3xl p-6 md:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400"><Target className="h-4 w-4" /> {selectedProblem.category}</div><h2 className="text-2xl font-black text-white">{selectedProblem.title}</h2><p className="mt-2 text-sm text-slate-400">{selectedProblem.difficulty} challenge · Focus on the pattern before the code.</p></div>
            <Link to={`/code-editor?problem=${encodeURIComponent(selectedProblem.id)}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-brand-500/40 bg-brand-500/10 px-3.5 py-2 text-xs font-bold text-brand-300 transition hover:bg-brand-500/20"><Code2 className="h-4 w-4" /> Practice this</Link>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-300">{selectedProblem.description}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{selectedProblem.examples?.map((example, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="mb-3 text-xs font-bold text-blue-700">Example {index + 1}</div><div className="space-y-3 font-mono text-sm"><div><span className="font-sans text-xs font-semibold text-slate-600">Input</span><div className="mt-1 break-words text-slate-800">{example.input}</div></div><div><span className="font-sans text-xs font-semibold text-slate-600">Output</span><div className="mt-1 break-words font-semibold text-emerald-800">{example.output}</div></div>{example.explanation && <div className="border-t border-slate-200 pt-2 font-sans text-xs leading-5 text-slate-600">{example.explanation}</div>}</div></div>)}</div>
          <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"><div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-300"><Lightbulb className="h-4 w-4 text-amber-400" /> Expected concepts</div><div className="flex flex-wrap gap-2">{selectedProblem.expected_concepts?.map((concept) => <span key={concept} className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-[11px] text-slate-300">{concept}</span>)}</div></div><div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"><div className="mb-3 text-xs font-bold text-slate-300">Constraints</div><pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-slate-400">{selectedProblem.constraints}</pre></div></div>
          <button type="button" onClick={() => setShowExplanation(!showExplanation)} className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-brand-300 hover:text-brand-200"><Eye className="h-4 w-4" /> {showExplanation ? 'Hide explanation' : 'Show solution explanation'}</button>
          {showExplanation && <div className="mt-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-sm leading-6 text-brand-100">{selectedProblem.explanation}</div>}
        </article>}
      </div>
    </div>
  );
};

export default CodingPractice;
