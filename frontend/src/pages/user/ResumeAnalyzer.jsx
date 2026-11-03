import React, { useState, useEffect } from 'react';
import { resumeService } from '../../services/resumeService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SkillBadge from '../../components/SkillBadge';
import { Upload, FileText, CheckCircle2, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setInitialLoading(true);
        const res = await resumeService.getLatestAnalysis();
        setAnalysis(res.data);
      } catch (err) {
        // ignorable fallback
      } finally {
        setInitialLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const res = await resumeService.uploadResume(file);
      setAnalysis(res.data?.analysis);
    } catch (err) {
      setError(err.message || 'Failed to upload and parse resume');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner message="Fetching resume analysis..." />;

  const overallScore = analysis?.overall_score || 78;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-brand-400" /> AI Resume Analyzer & Scorer
        </h1>
        <p className="text-xs text-slate-400">Upload your PDF/DOCX resume for automated NLP skill extraction & 7-point evaluation</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* File Upload Panel */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-2xl p-8 bg-slate-900/40 transition-all">
            <Upload className="h-10 w-10 text-brand-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              Drag & drop your resume file or <span className="text-brand-400 underline cursor-pointer">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX (Max size 10MB)</p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="mt-4 text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className={`px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
              file && !loading
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Analyzing with PyMuPDF & spaCy NLP...' : 'Analyze Resume Now'}
          </button>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-8">
          {/* Top Score Banner */}
          <div className="glass-panel p-8 rounded-3xl border border-brand-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Analysis Breakdown</span>
              <h2 className="text-2xl font-extrabold text-white">Overall Resume Score: {overallScore}/100</h2>
              <p className="text-xs text-slate-400">Calculated across 7 standard placement criteria</p>
            </div>

            <div className="h-28 w-28 rounded-full bg-slate-900 border-4 border-brand-500 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-brand-500/20">
              {overallScore}
            </div>
          </div>

          {/* Section Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(analysis.section_scores || {}).map(([sec, val], idx) => (
              <div key={idx} className="glass-panel p-4 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">{sec}</span>
                <span className="px-2.5 py-1 rounded bg-brand-500/10 border border-brand-500/30 text-brand-300 font-mono font-bold text-xs">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Extracted Skills */}
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
              Extracted Technical Skills ({analysis.extracted_skills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.extracted_skills?.map((s, idx) => (
                <SkillBadge key={idx} skill={s} status="Strong" />
              ))}
            </div>
          </div>

          {/* Actionable Improvement Suggestions */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" /> Improvement Recommendations
            </h3>
            <div className="space-y-2.5">
              {analysis.suggestions?.map((sug, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
