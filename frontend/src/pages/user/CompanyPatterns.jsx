import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyPatterns = () => {
  const patterns = [
    { name: "TCS NQT Pattern", desc: "Aptitude (20 Qs), Reasoning (20 Qs), Verbal (25 Qs), Coding (2 Problems)", duration: "165 mins" },
    { name: "Infosys Test Pattern", desc: "Mathematical Ability (15 Qs), Reasoning (15 Qs), Verbal (20 Qs), Pseudo-code (5 Qs)", duration: "100 mins" },
    { name: "Accenture Placement Pattern", desc: "Cognitive Ability (50 Qs), Technical Assessment (40 Qs), Coding (2 Problems)", duration: "135 mins" },
    { name: "Wipro Elite Pattern", desc: "Aptitude & Reasoning (40 Qs), Written English (1 Essay), Coding (2 Problems)", duration: "128 mins" },
    { name: "Cognizant GenC Pattern", desc: "Quantitative (25 Qs), Analytical (25 Qs), Verbal (25 Qs)", duration: "100 mins" }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="h-6 w-6 text-brand-400" /> Company-Pattern Practice
        </h1>
        <p className="text-xs text-slate-400">Simulated test patterns based on top IT hiring company formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map((p, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between glass-panel-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                  Company Pattern
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">{p.duration}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Link
                to="/mock-tests"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                Practice Pattern Test <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyPatterns;
