import React, { useEffect, useState } from 'react';
import { performanceService } from '../../services/performanceService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Code2, CheckCircle2, Play, Eye } from 'lucide-react';

const CodingPractice = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProb, setSelectedProb] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const res = await performanceService.getCodingProblems();
        setProblems(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedProb(res.data[0]);
          setUserCode(res.data[0].sample_solution || '# Write your Python solution here');
        }
      } catch (err) {
        setError(err.message || 'Failed to load coding catalog');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleSelect = (prob) => {
    setSelectedProb(prob);
    setUserCode(prob.sample_solution || '# Write your solution here');
    setShowSolution(false);
  };

  if (loading) return <LoadingSpinner message="Loading DSA coding catalog..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Code2 className="h-6 w-6 text-brand-400" /> Basic Coding Practice & Solution Browser
        </h1>
        <p className="text-xs text-slate-400">Essential Data Structure and Algorithm problem browser with sample walkthroughs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Problem Catalog</h3>
          <div className="space-y-2">
            {problems.map((p) => {
              const isSelected = selectedProb?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/15 text-white font-semibold'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-brand-400">{p.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">{p.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Code Editor View */}
        <div className="lg:col-span-2 space-y-4">
          {selectedProb && (
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedProb.title}</h3>
                  <span className="text-xs text-slate-400">{selectedProb.category} • {selectedProb.difficulty}</span>
                </div>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" /> {showSolution ? 'Hide Solution' : 'View Solution'}
                </button>
              </div>

              {/* Problem Description */}
              <p className="text-xs text-slate-300 leading-relaxed">{selectedProb.description}</p>

              {/* Examples */}
              {selectedProb.examples?.map((ex, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs font-mono space-y-1">
                  <div className="text-brand-400 font-bold">Example {idx + 1}:</div>
                  <div><span className="text-slate-400">Input:</span> {ex.input}</div>
                  <div><span className="text-slate-400">Output:</span> {ex.output}</div>
                </div>
              ))}

              {/* Code Editor */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">Solution Editor (Python 3)</label>
                <textarea
                  rows={8}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-brand-500 leading-relaxed"
                />
              </div>

              {showSolution && (
                <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/30 text-xs text-brand-200 space-y-2">
                  <div className="font-bold text-brand-400 uppercase tracking-wider">Solution Explanation</div>
                  <p>{selectedProb.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
