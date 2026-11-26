import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Code2, Copy, FileCode2, Play, RotateCcw, Terminal, XCircle, ChevronDown } from 'lucide-react';
import { performanceService } from '../../services/performanceService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const LANGUAGE_STARTERS = {
  python: '# Write your Python solution here\n\ndef solve():\n    pass\n\nsolve()',
  javascript: '// Write your JavaScript solution here\n\nfunction solve() {\n  console.log("Start solving!");\n}\n\nsolve();',
  java: '// Write your Java solution here\n\nclass Main {\n  public static void main(String[] args) {\n    // your code\n  }\n}',
  c: '// Write your C solution here\n\n#include <stdio.h>\n\nint main(void) {\n  // your code\n  return 0;\n}',
  cpp: '// Write your C++ solution here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n  // your code\n  return 0;\n}',
};

const CodeEditor = () => {
  const [searchParams] = useSearchParams();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await performanceService.getCodingProblems();
        setSelectedProblem(data?.find((problem) => problem.id === searchParams.get('problem')) || data?.[0] || null);
        setUserCode(LANGUAGE_STARTERS.python);
      } catch (err) {
        setError(err.message || 'Failed to load editor problems');
      } finally {
        setLoading(false);
      }
    };
    loadProblems();
  }, [searchParams]);

  const changeLanguage = (nextLanguage) => { setLanguage(nextLanguage); setUserCode(LANGUAGE_STARTERS[nextLanguage]); setResult(null); };

  const runCode = async () => {
    if (!selectedProblem || !userCode.trim() || running) return;
    setRunning(true);
    setResult(null);
    try {
      const data = await performanceService.runCode({ problem_id: selectedProblem.id, language, source_code: userCode, stdin });
      setResult(data);
    } catch (err) {
      setResult({ error: err.response?.data?.detail || err.message || 'Unable to run code' });
    } finally {
      setRunning(false);
    }
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); runCode(); return; }
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = event.currentTarget.selectionStart;
      setUserCode(`${userCode.slice(0, start)}    ${userCode.slice(event.currentTarget.selectionEnd)}`);
      requestAnimationFrame(() => { event.currentTarget.selectionStart = start + 4; event.currentTarget.selectionEnd = start + 4; });
    }
  };

  const copyCode = async () => { try { await navigator.clipboard.writeText(userCode); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* unavailable in insecure previews */ } };

  if (loading) return <LoadingSpinner message="Opening code editor..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/coding-practice" className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-brand-300"><ArrowLeft className="h-3.5 w-3.5" /> Back to Coding Questions</Link>
          <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-white"><Code2 className="h-7 w-7 text-brand-400" /> Code Editor</h1>
          <p className="mt-1 text-sm text-slate-400">A focused workspace for writing and running your solution.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500"><FileCode2 className="h-4 w-4 text-brand-400" /> Secure code runner</div>
      </header>

      {selectedProblem && <section className="glass-panel rounded-2xl px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-600"><span>{selectedProblem.category}</span><span aria-hidden="true">·</span><span>{selectedProblem.difficulty}</span></div>
        <h2 className="mt-1 text-lg font-bold text-slate-900">{selectedProblem.title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{selectedProblem.description}</p>
        <Link to="/coding-practice" className="mt-2 inline-flex text-xs font-bold text-brand-600 hover:text-brand-700">View all problem details <ArrowLeft className="ml-1 h-3.5 w-3.5 rotate-180" /></Link>
      </section>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-300/30">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><span className="text-xs font-semibold text-slate-600">solution.{language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : language}</span></div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="editor-language" className="sr-only">Programming language</label>
            <select id="editor-language" value={language} onChange={(event) => changeLanguage(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-500"><option value="python">Python 3</option><option value="javascript">JavaScript</option><option value="java">Java</option><option value="c">C</option><option value="cpp">C++</option></select>
            <button type="button" onClick={copyCode} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-blue-50">{copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}</button>
            <button type="button" onClick={() => { setUserCode(LANGUAGE_STARTERS[language]); setResult(null); }} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-600 transition hover:bg-blue-50"><RotateCcw className="h-3.5 w-3.5" /> Reset</button>
            <button type="button" onClick={runCode} disabled={running || !userCode.trim() || !selectedProblem} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><Play className="h-4 w-4" /> {running ? 'Running…' : 'Run'}</button>
          </div>
        </div>

        <div className="relative h-[340px] bg-white sm:h-[390px]">
          <div className="absolute inset-y-0 left-0 w-12 select-none overflow-hidden border-r border-slate-200 bg-slate-50 py-4 text-right font-mono text-xs leading-6 text-slate-400" aria-hidden="true">{Array.from({ length: Math.max(1, userCode.split('\n').length) }, (_, index) => <div key={index} className="pr-3">{index + 1}</div>)}</div>
          <textarea value={userCode} onChange={(event) => setUserCode(event.target.value)} onKeyDown={handleKeyDown} spellCheck="false" aria-label="Code editor" className="h-full w-full resize-none bg-transparent py-4 pl-16 pr-5 font-mono text-sm leading-6 text-slate-800 outline-none selection:bg-blue-100" />
        </div>

        <details className="border-t border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-slate-600"><span>Custom input <span className="font-normal text-slate-400">(optional)</span></span><ChevronDown className="h-4 w-4 transition-transform open:rotate-180" /></summary>
          <label htmlFor="editor-stdin" className="sr-only">Custom input passed to your program</label>
          <textarea id="editor-stdin" value={stdin} onChange={(event) => setStdin(event.target.value)} rows={2} placeholder="Values passed to your program" className="mt-3 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 font-mono text-xs text-slate-700 outline-none focus:border-brand-500" />
        </details>
      </section>

      <p className="text-center text-[11px] text-slate-500">Press Ctrl/Cmd + Enter to run your code.</p>

      {result && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-live="polite">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"><Terminal className="h-4 w-4 text-emerald-600" /> Run output</div>
        {result.error ? <div className="flex gap-2 text-sm leading-6 text-rose-700"><XCircle className="mt-0.5 h-4 w-4 shrink-0" /><pre className="whitespace-pre-wrap font-mono">{result.error}</pre></div> : <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700"><Check className="h-4 w-4" /> {result.status}</div>
          {result.stdout ? <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-700">{result.stdout}</pre> : <p className="text-xs text-slate-500">No output produced.</p>}
          {result.compile_output && <pre className="whitespace-pre-wrap rounded-lg bg-amber-50 p-3 font-mono text-xs text-amber-800">{result.compile_output}</pre>}
          {result.stderr && <pre className="whitespace-pre-wrap rounded-lg bg-rose-50 p-3 font-mono text-xs text-rose-800">{result.stderr}</pre>}
        </div>}
      </section>}
    </div>
  );
};

export default CodeEditor;
