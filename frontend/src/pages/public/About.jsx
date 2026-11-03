import React from 'react';
import { Target, Award, ShieldCheck, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-white">About CareerAI Platform</h1>
        <p className="text-slate-400 text-sm">Empowering students with AI intelligence and structured placement preparation</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl space-y-4 text-slate-300 text-sm leading-relaxed">
        <p>
          CareerAI is an end-to-end career intelligence and placement preparation software suite specifically tailored for B.Tech/B.E computer science and engineering students.
        </p>
        <p>
          By bridging raw academic learning with real industry skill demands, CareerAI enables candidates to systematically evaluate their readiness score, parse resumes, diagnose weak subjects, and prepare for placement interviews.
        </p>
      </div>
    </div>
  );
};

export default About;
