import React, { useEffect, useState } from 'react';
import { Building2, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CompanyPatterns = () => {
  const [companyLinks, setCompanyLinks] = useState([]);
  useEffect(() => { api.get('/updates/company-links').then((result) => setCompanyLinks(result.data || [])).catch(() => setCompanyLinks([])); }, []);
  const patterns = [
    { slug: 'tcs', name: "TCS NQT Pattern", desc: "Aptitude (20 Qs), Reasoning (20 Qs), Verbal (25 Qs), Coding (2 Problems)", duration: "165 mins" },
    { slug: 'infosys', name: "Infosys Test Pattern", desc: "Mathematical Ability (15 Qs), Reasoning (15 Qs), Verbal (20 Qs), Pseudo-code (5 Qs)", duration: "100 mins" },
    { slug: 'accenture', name: "Accenture Placement Pattern", desc: "Cognitive Ability (50 Qs), Technical Assessment (40 Qs), Coding (2 Problems)", duration: "135 mins" },
    { slug: 'wipro', name: "Wipro Elite Pattern", desc: "Aptitude & Reasoning (40 Qs), Written English (1 Essay), Coding (2 Problems)", duration: "128 mins" },
    { slug: 'cognizant', name: "Cognizant GenC Pattern", desc: "Quantitative (25 Qs), Analytical (25 Qs), Verbal (25 Qs)", duration: "100 mins" }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="h-6 w-6 text-brand-400" /> Company-Pattern Practice
        </h1>
        <p className="text-xs text-slate-400">Reference summaries of common campus assessment formats. Employers can change their tests; these are not live or official specifications.</p>
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
                to={`/company-prep/${p.slug}`}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                Company prep & practice <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {companyLinks.length > 0 && <section className="space-y-3"><div><h2 className="text-lg font-bold text-white">Company careers links</h2><p className="text-xs text-slate-400">Links published by your CareerAI administrator.</p></div><div className="grid gap-3 sm:grid-cols-2">{companyLinks.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="glass-panel flex items-center justify-between gap-3 rounded-2xl p-4 transition hover:border-blue-300"><span className="min-w-0"><span className="block font-bold text-white">{link.name}</span>{link.description && <span className="mt-1 block text-xs text-slate-400">{link.description}</span>}</span><ExternalLink className="h-4 w-4 shrink-0 text-blue-400" /></a>)}</div></section>}
    </div>
  );
};

export default CompanyPatterns;
