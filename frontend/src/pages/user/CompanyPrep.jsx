import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Code2, FileQuestion, ShieldAlert } from 'lucide-react';
import { companyPrepService } from '../../services/companyPrepService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const CompanyPrep = () => {
  const { companySlug } = useParams();
  const [pattern, setPattern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    companyPrepService.getPattern(companySlug)
      .then((result) => active && setPattern(result))
      .catch((err) => active && setError(err.message || 'Could not load this company preparation guide.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [companySlug]);

  if (loading) return <LoadingSpinner message="Loading company preparation guide…" />;
  if (error) return <ErrorMessage message={error} />;
  if (!pattern) return <ErrorMessage message="This company practice pattern was not found." />;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link to="/company-patterns" className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"><ArrowLeft className="h-4 w-4" /> All company patterns</Link>
        <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 sm:p-8">
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700"><BookOpen className="h-3.5 w-3.5" /> Company preparation</div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{pattern.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{pattern.summary}</p>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"><Clock3 className="h-4 w-4 text-blue-600" /> Reference duration: {pattern.duration_minutes} mins</div>
          </div>
        </section>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <p>{pattern.content_notice} Employer formats can change; use the section counts above as a preparation guide.</p>
      </div>

      <section className="space-y-3">
        <div><h2 className="text-lg font-bold text-slate-900">What to prepare</h2><p className="text-xs text-slate-500">Review the focus areas for each section.</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          {pattern.sections.map((section) => (
            <article key={section.name} className="glass-panel rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3"><h3 className="font-bold text-slate-900">{section.name}</h3><span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">{section.count} questions</span></div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{section.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-5">
        <h2 className="text-base font-bold text-slate-900">Preparation tips</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">{pattern.strategy.map((tip) => <li key={tip}>{tip}</li>)}</ul>
      </section>

      {pattern.essay_prompt && <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5"><h2 className="font-bold text-indigo-950">Written English practice prompt</h2><p className="mt-2 text-sm leading-6 text-indigo-900">{pattern.essay_prompt}</p></section>}

      {pattern.coding_focus?.length > 0 && <section className="glass-panel rounded-2xl p-5">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><Code2 className="h-4 w-4 text-blue-600" /> Coding practice focus</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">{pattern.coding_focus.map((item) => <li key={item}>{item}</li>)}</ul>
        <Link to="/coding-practice" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800">Open coding question library <ArrowRight className="h-3.5 w-3.5" /></Link>
      </section>}

      <section className="grid gap-4 sm:grid-cols-2">
        <Link to={`/mcq-practice?company=${pattern.slug}`} className="group rounded-2xl bg-blue-600 p-5 text-white shadow-lg shadow-blue-900/10 transition hover:-translate-y-0.5 hover:bg-blue-700">
          <div className="flex items-center justify-between"><FileQuestion className="h-5 w-5" /><ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
          <h2 className="mt-4 font-bold">Practice {pattern.practice_question_count} {pattern.company}-style MCQs</h2>
          <p className="mt-1 text-xs text-blue-100">Company-specific questions with explanations</p>
        </Link>
        <Link to={`/mock-tests?company=${pattern.slug}`} className="group rounded-2xl border border-blue-200 bg-white p-5 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400">
          <div className="flex items-center justify-between text-blue-700"><Clock3 className="h-5 w-5" /><ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
          <h2 className="mt-4 font-bold">Take the {pattern.company} practice mock</h2>
          <p className="mt-1 text-xs text-slate-500">A separate 10-question pattern-aligned practice set</p>
        </Link>
      </section>
    </div>
  );
};

export default CompanyPrep;
