import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, FileText, Target, CheckCircle, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="h-4 w-4" /> B.Tech Placement Intelligence & Readiness Engine
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Build the career you're <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">ready for.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Analyze your skills, discover the right career, close your skill gaps, and prepare for campus placement tests with personalized learning, timed mock assessments, and AI analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 transition-all flex items-center justify-center gap-2"
          >
            Get Started Free <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base transition-colors"
          >
            Explore Demo Account
          </Link>
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-8 p-4 rounded-2xl glass-panel max-w-md mx-auto text-left text-xs border border-slate-800 space-y-2">
          <div className="font-bold text-brand-400 uppercase tracking-wider">Demo Credentials</div>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div><span className="text-slate-400">Student:</span> user@careerai.com</div>
            <div><span className="text-slate-400">Pass:</span> User@123</div>
            <div><span className="text-slate-400">Admin:</span> admin@careerai.com</div>
            <div><span className="text-slate-400">Pass:</span> Admin@123</div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-2xl space-y-4">
          <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">AI Resume Analyzer</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Upload PDF/DOCX resumes. Get a 7-section breakdown score with NLP skill extraction and targeted improvement feedback.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl space-y-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Skill Gap Analysis</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Compare your profile against target roles (Java Developer, Python Backend, Data Analyst) to spot missing competencies.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl space-y-4">
          <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Placement Mock Tests</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Practice Aptitude, Reasoning, Verbal, and CS core MCQs under timed test conditions with negative marking diagnostics.
          </p>
        </div>
      </section>

      {/* Journey Banner */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-brand-500/20 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">The CareerAI Readiness Journey</h2>
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-semibold text-slate-300">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">1. Register Profile</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">2. Upload Resume</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">3. Match Career Goal</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">4. Practice MCQs</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">5. Take Mock Test</span>
          <span>→</span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">6. Get Placement Ready</span>
        </div>
      </section>
    </div>
  );
};

export default Home;
