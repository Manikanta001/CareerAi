import React, { useEffect, useRef, useState } from 'react';
import { FileText, Loader2, Upload } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ResumeLearningReport from '../../components/ResumeLearningReport';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([resumeService.getLatestAnalysis(), resumeService.getOnboardingReport()])
      .then(([analysisResult, reportResult]) => {
        if (!active) return;
        if (analysisResult?.overall_score != null) setAnalysis(analysisResult);
        if (reportResult?.has_resume) setReport(reportResult);
      })
      .catch((err) => active && setError(err.message || 'Could not load your saved resume analysis.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    setError('');
    if (!file) return;
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setError('Upload a PDF or DOCX file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Your resume must be 10 MB or smaller.');
      return;
    }

    const previousReport = report;
    let resumeWasSaved = false;
    setUploading(true);
    setReport(null);
    try {
      const uploaded = await resumeService.uploadResume(file);
      if (!uploaded?.analysis || typeof uploaded.analysis.overall_score !== 'number') {
        throw new Error('The resume could not be analyzed. Try a text-based PDF or DOCX.');
      }
      resumeWasSaved = true;
      setAnalysis(uploaded.analysis);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      const nextReport = await resumeService.getOnboardingReport();
      if (!nextReport?.has_resume) throw new Error('Resume analysis completed, but the learning report was not available. Please retry.');
      setReport(nextReport);
    } catch (err) {
      if (!resumeWasSaved) setReport(previousReport);
      setError(err.message || 'Resume analysis failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your saved resume analysis…" />;

  const sectionScores = Object.entries(analysis?.section_scores || {}).map(([name, value]) => {
    const [score, max] = String(value).split('/').map(Number);
    const points = Number.isFinite(score) ? score : 0;
    const maximum = Number.isFinite(max) ? max : 0;
    return { name: name.replace('Overall ', ''), score: maximum ? (points / maximum) * 100 : 0, points, max: maximum };
  });

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-white"><FileText className="h-6 w-6 text-brand-400" /> Resume & Learning Plan</h1>
        <p className="mt-1 text-sm text-slate-400">Upload a PDF or DOCX (up to 10 MB) to refresh the skills and study recommendations detected from your resume.</p>
      </header>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleUpload} className="glass-panel flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label htmlFor="resume-refresh" className="block text-sm font-semibold text-white">{file?.name || 'Choose a resume file'}</label>
          <p className="mt-1 text-xs text-slate-400">The report updates only after the file is successfully analyzed.</p>
          <input ref={fileInputRef} id="resume-refresh" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { setFile(event.target.files?.[0] || null); setError(''); }} className="mt-3 block max-w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white" />
        </div>
        <button type="submit" disabled={!file || uploading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50">
          {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : <><Upload className="h-4 w-4" /> Analyze resume</>}
        </button>
      </form>

      {analysis && (
        <div className="glass-panel rounded-2xl p-5 space-y-5">
          <div>
            <p className="text-sm font-semibold text-white">Resume content score: {analysis.overall_score}/100</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{analysis.score_basis || 'A text-based estimate of resume structure and detected keywords. It does not measure skill proficiency or guarantee recruiter outcomes.'}</p>
            {analysis.word_count != null && <p className="mt-1 text-[11px] text-slate-400">Scored from {analysis.word_count.toLocaleString()} words extracted from your file.</p>}
            {analysis.word_count != null && analysis.word_count < 120 && <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs leading-5 text-amber-900">We extracted very little text. If this score looks too low, upload a text-based PDF or DOCX; scanned image resumes may need OCR before they can be assessed accurately.</p>}
          </div>
          {sectionScores.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-white">Score by resume section</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectionScores} layout="vertical" margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={120} stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value, _label, item) => [`${item.payload.points}/${item.payload.max} (${Math.round(value)}%)`, 'Score']}
                      contentStyle={{ backgroundColor: '#ffffff', color: '#172033', borderColor: '#cbd5e1', borderRadius: '12px' }}
                    />
                    <Bar dataKey="score" fill="#2563eb" radius={[0, 5, 5, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {report ? <ResumeLearningReport report={report} /> : !analysis && !error && (
        <div className="glass-panel rounded-2xl p-6 text-sm text-slate-300">No resume analysis is saved yet. Upload a resume to see skills detected and topics to study.</div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
