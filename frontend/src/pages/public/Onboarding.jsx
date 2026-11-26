import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Loader2, ShieldCheck, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { careerService } from '../../services/careerService';
import { resumeService } from '../../services/resumeService';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import ResumeLearningReport from '../../components/ResumeLearningReport';

const FALLBACK_CAREERS = [
  'Software Developer', 'Python Developer', 'Frontend Developer',
  'Full Stack Developer', 'Data Analyst',
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, setUser, completeOnboarding } = useAuth();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [careerGoal, setCareerGoal] = useState('Software Developer');
  const [careers, setCareers] = useState(FALLBACK_CAREERS);
  const [profile, setProfile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingCareer, setSavingCareer] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');
  const [reportError, setReportError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([authService.getProfile(), careerService.getAllCareers()])
      .then(async ([profileResponse, careerResponse]) => {
        if (!active) return;
        const nextProfile = profileResponse;
        setProfile(nextProfile);
        setCareerGoal(nextProfile?.preferred_career || 'Software Developer');
        const titles = (careerResponse || []).map((career) => career.title).filter(Boolean);
        if (titles.length) setCareers(titles);
        try {
          const statusResponse = await resumeService.getOnboardingStatus();
          if (active && statusResponse?.has_resume) {
            const savedReport = await resumeService.getOnboardingReport();
            if (active && savedReport?.has_resume) setReport(savedReport);
          }
        } catch (err) {
          if (active) setReportError(`Your saved resume report could not be loaded: ${err.message}`);
        }
      })
      .catch((err) => {
        if (active) setError(`We could not load your profile settings: ${err.message}`);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const selectedCareerExists = useMemo(() => careers.includes(careerGoal), [careers, careerGoal]);

  const persistCareerGoal = async (nextCareer = careerGoal) => {
    const currentProfile = profile || (await authService.getProfile());
    const updated = await authService.updateProfile({ ...currentProfile, preferred_career: nextCareer });
    setProfile((previous) => ({ ...(previous || currentProfile), preferred_career: nextCareer }));
    const nextUser = { ...user, preferred_career: nextCareer };
    setUser(nextUser);
    localStorage.setItem('careerai_user', JSON.stringify(nextUser));
    return updated;
  };

  const handleCareerChange = async (event) => {
    const nextCareer = event.target.value;
    setCareerGoal(nextCareer);
    setError('');
    if (!nextCareer) return;
    setSavingCareer(true);
    try {
      await persistCareerGoal(nextCareer);
    } catch (err) {
      setError(`Could not save your career goal: ${err.message}`);
    } finally {
      setSavingCareer(false);
    }
  };

  const loadReport = async () => {
    setReportError('');
    try {
      const nextReport = await resumeService.getOnboardingReport();
      if (!nextReport?.has_resume) throw new Error('No analyzed resume was found. Upload your resume to build the report.');
      setReport(nextReport);
    } catch (err) {
      setReportError(err.message || 'The personalized learning report could not be loaded.');
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError('');
    setReportError('');
    setNotice('');
    if (!file) {
      setError('Choose a PDF or DOCX resume first.');
      return;
    }
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setError('Upload a PDF or DOCX file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Your resume must be 10 MB or smaller.');
      return;
    }

    setUploading(true);
    setReport(null);
    try {
      await persistCareerGoal();
      const uploaded = await resumeService.uploadResume(file);
      if (!uploaded?.analysis || typeof uploaded.analysis.overall_score !== 'number') {
        throw new Error('The resume could not be analyzed. Please try a text-based PDF or DOCX.');
      }
      setNotice('Resume uploaded and analyzed. Preparing your study recommendations…');
      await loadReport();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Resume analysis failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const finish = async () => {
    setFinishing(true);
    setError('');
    try {
      await resumeService.completeOnboarding();
      completeOnboarding();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not save your onboarding status. Please try again.');
    } finally {
      setFinishing(false);
    }
  };

  const skip = async () => {
    setFinishing(true);
    setError('');
    try {
      await resumeService.completeOnboarding();
      completeOnboarding();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not save your choice. Please try again.');
    } finally {
      setFinishing(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Preparing your career plan…" />;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-7">
        <header className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/10">
            <FileText className="h-7 w-7 text-brand-300" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">A more useful starting point</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">Let’s build your study plan{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Add your resume so CareerAI can identify the skills and experience you’ve listed, compare them with your career goal, and suggest what to study next. Your resume is used to personalize your recommendations.
          </p>
        </header>

        {error && <ErrorMessage message={error} />}
        {notice && !reportError && <p role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-200">{notice}</p>}
        {reportError && (
          <div className="space-y-3">
            <ErrorMessage message={`We could not load your saved learning report: ${reportError}`} />
            <button type="button" onClick={loadReport} className="text-sm font-semibold text-brand-300 hover:text-white">Retry loading the report</button>
          </div>
        )}

        {!report && (
          <section className="glass-panel rounded-3xl border border-slate-800 p-5 sm:p-8">
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label htmlFor="career-goal" className="mb-2 block text-sm font-semibold text-slate-200">What role are you preparing for?</label>
                <select
                  id="career-goal"
                  value={selectedCareerExists ? careerGoal : ''}
                  onChange={handleCareerChange}
                  disabled={savingCareer || uploading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  {!selectedCareerExists && <option value="">Choose a career goal</option>}
                  {careers.map((career) => <option key={career} value={career}>{career}</option>)}
                </select>
              </div>

              <label htmlFor="resume-file" className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-7 text-center transition-colors hover:border-brand-500/60">
                <UploadCloud className="mx-auto h-9 w-9 text-brand-300" />
                <span className="mt-3 block text-sm font-semibold text-white">{file ? file.name : 'Choose your resume'}</span>
                <span className="mt-1 block text-xs text-slate-400">PDF or DOCX, up to 10 MB</span>
                <input ref={fileInputRef} id="resume-file" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => { setFile(event.target.files?.[0] || null); setError(''); }} className="sr-only" />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={uploading || savingCareer || !file || !careerGoal} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50">
                  {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing resume…</> : <>Upload & build my study plan <ArrowRight className="h-4 w-4" /></>}
                </button>
                <button type="button" onClick={skip} disabled={finishing || uploading || savingCareer} className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50">
                  {finishing ? 'Saving…' : 'Skip for now'}
                </button>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500"><ShieldCheck className="h-3.5 w-3.5" /> Your recommendations only use details actually detected in your resume.</p>
            </form>
          </section>
        )}

        {report && (
          <>
            <ResumeLearningReport report={report} />
            <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button type="button" onClick={() => { setReport(null); setNotice(''); }} className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white">Upload a different resume</button>
              <button type="button" onClick={finish} disabled={finishing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-500 disabled:opacity-50">
                {finishing ? 'Saving…' : 'Continue to CareerAI'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Onboarding;
