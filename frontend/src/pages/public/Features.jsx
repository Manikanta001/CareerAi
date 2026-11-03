import React from 'react';
import { FileText, Target, Award, Briefcase, HelpCircle, FileQuestion, LineChart, Code2 } from 'lucide-react';

const Features = () => {
  const features = [
    { icon: FileText, title: "Resume Parser & Scorer", desc: "Extract skills and parse 7 key sections with improvement advice." },
    { icon: Target, title: "Career Match Engine", desc: "Cosine similarity algorithm matching candidate profiles with roles." },
    { icon: Award, title: "Skill Gap Matrix", desc: "Compare target career requirements against your current technical skills." },
    { icon: Briefcase, title: "Job Recommender", desc: "Match your skill sets with sample tech job openings." },
    { icon: HelpCircle, title: "MCQ Engine", desc: "Practice Aptitude, Reasoning, Verbal, and CS core questions." },
    { icon: FileQuestion, title: "Mock Test Engine", desc: "Simulate real test pressure with negative marking timers." },
    { icon: LineChart, title: "Performance Analytics", desc: "Recharts dashboards showing score trends and weak topic diagnostics." },
    { icon: Code2, title: "Coding Practice", desc: "Solve classic DSA problems with built-in code editor views." },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">Platform Modules & Features</h1>
        <p className="text-slate-400 text-sm">Comprehensive career intelligence tools built for placement success</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">{f.title}</h3>
              <p className="text-xs text-slate-400">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
