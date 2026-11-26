import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, GraduationCap, Lightbulb, Target } from 'lucide-react';
import ProgressBar from './ProgressBar';
import SkillBadge from './SkillBadge';
import { resumeService } from '../services/resumeService';

const SectionSummary = ({ title, icon: Icon, items }) => (
  <section className="glass-panel rounded-2xl p-5 space-y-3">
    <h3 className="flex items-center gap-2 text-sm font-bold text-white">
      <Icon className="h-4 w-4 text-brand-400" /> {title}
    </h3>
    {items?.length ? (
      <ul className="space-y-2 text-sm text-slate-300">
        {items.map((item, index) => <li key={`${item}-${index}`} className="leading-relaxed">{item}</li>)}
      </ul>
    ) : (
      <p className="text-xs text-slate-500">No clear {title.toLowerCase()} details were detected in the resume.</p>
    )}
  </section>
);

const SkillList = ({ skills, emptyText }) => (
  skills?.length ? (
    <div className="flex flex-wrap gap-2">{skills.map((skill) => <SkillBadge key={skill} skill={skill} />)}</div>
  ) : <p className="text-xs text-slate-500">{emptyText}</p>
);

const ResumeLearningReport = ({ report }) => {
  const [completedSkills, setCompletedSkills] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressSaving, setProgressSaving] = useState(false);
  const [progressError, setProgressError] = useState('');

  useEffect(() => {
    let active = true;
    setProgressLoading(true);
    setCompletedSkills([]);
    resumeService.getLearningProgress()
      .then((progress) => active && setCompletedSkills(progress.completed_skills || []))
      .catch((err) => active && setProgressError(err.message || 'Could not load saved study progress.'))
      .finally(() => active && setProgressLoading(false));
    return () => { active = false; };
  }, [report]);

  const toggleCompleted = async (skill) => {
    const previous = completedSkills;
    const next = previous.includes(skill)
      ? previous.filter((item) => item !== skill)
      : [...previous, skill];
    setCompletedSkills(next);
    setProgressError('');
    setProgressSaving(true);
    try {
      const saved = await resumeService.saveLearningProgress(next);
      setCompletedSkills(saved.completed_skills || []);
    } catch (err) {
      setCompletedSkills(previous);
      setProgressError(err.message || 'Could not save this progress update.');
    } finally {
      setProgressSaving(false);
    }
  };

  if (!report?.has_resume) return null;

  const sectionData = report.sections_found || {};
  const readiness = report.readiness_percentage == null ? null : Number(report.readiness_percentage);

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-3xl border border-brand-500/20 p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-300">Your learning baseline</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{report.career_goal || 'Career goal'}</h2>
            <p className="mt-1 text-sm text-slate-400">Based on skills detected in {report.filename || 'your uploaded resume'}.</p>
          </div>
          {report.resume_score != null && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-center">
              <div className="text-2xl font-bold text-white">{report.resume_score}<span className="text-sm text-slate-400">/100</span></div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400">Resume score</div>
            </div>
          )}
        </div>
        {readiness != null && <>
          <ProgressBar value={readiness} label="Required skill keywords found in your resume" color="emerald" />
          <p className="text-[11px] text-slate-500">This is a keyword match, not a measure of your actual proficiency.</p>
        </>}
        {report.message && <p role="status" className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">{report.message}</p>}
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <p className="col-span-full -mb-1 text-[11px] text-slate-500">Education, project, and experience details below are excerpts detected in your resume.</p>
        <SectionSummary title="Education" icon={GraduationCap} items={sectionData.education} />
        <SectionSummary title="Projects" icon={Lightbulb} items={sectionData.projects} />
        <SectionSummary title="Experience" icon={Briefcase} items={sectionData.experience} />
      </div>

      <section className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Skills detected</h3>
          <p className="mt-1 text-xs text-slate-400">These are keywords found in the resume, not a proficiency assessment.</p>
        </div>
        <SkillList skills={report.extracted_skills} emptyText="No skills from our supported list were detected. Try a text-based PDF or DOCX with a clear skills section." />
        <div className="border-t border-slate-800 pt-4">
          <h4 className="mb-2 text-xs font-semibold text-emerald-300">Relevant to this career goal</h4>
          <SkillList skills={report.known_skills} emptyText={report.analysis_incomplete ? 'Not assessed because the resume did not yield detectable skills.' : 'No target-role skills were detected yet.'} />
        </div>
      </section>

      <section className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-amber-300" />
          <div>
            <h3 className="text-sm font-bold text-white">Topics to work on</h3>
            <p className="text-xs text-slate-400">Required gaps are prioritized first; preferred skills are optional next steps.</p>
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold text-amber-200">Required</h4>
          <SkillList skills={report.missing_required} emptyText={report.analysis_incomplete ? 'No gaps were inferred because the resume did not yield detectable skills.' : 'No required skill gaps were found for this role.'} />
        </div>
        {!!report.missing_preferred?.length && (
          <div className="border-t border-slate-800 pt-4">
            <h4 className="mb-2 text-xs font-semibold text-slate-300">Preferred</h4>
            <SkillList skills={report.missing_preferred} emptyText="No preferred skill gaps." />
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Prioritized study plan</h3>
            <p className="text-xs text-slate-400">Start with required topics, then build the preferred skills.</p>
          </div>
          <Link to="/mcq-practice" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand-300 hover:text-white">Practice questions <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        {report.learning_plan?.length > 0 && (
          <div className="glass-panel rounded-2xl p-4 space-y-2">
            <ProgressBar
              value={completedSkills.length}
              max={report.learning_plan.length}
              label={`Study plan progress · ${completedSkills.length} of ${report.learning_plan.length} topics complete`}
              color="emerald"
            />
            <p className="text-[11px] text-slate-500">Your completed topics are saved to your account.</p>
            {progressLoading && <p className="text-xs text-slate-400">Loading saved progress…</p>}
            {progressError && <p role="alert" className="text-xs text-rose-300">{progressError}</p>}
          </div>
        )}
        {report.learning_plan?.length ? report.learning_plan.map((item, index) => (
          <article key={`${item.skill}-${index}`} className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={completedSkills.includes(item.skill)}
                disabled={progressSaving || progressLoading}
                onChange={() => toggleCompleted(item.skill)}
                aria-label={`Mark ${item.skill} ${completedSkills.includes(item.skill) ? 'incomplete' : 'complete'}`}
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-sm font-bold text-white ${completedSkills.includes(item.skill) ? 'line-through opacity-60' : ''}`}>{index + 1}. {item.skill}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.priority === 'High' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700 text-slate-300'}`}>{item.priority} priority</span>
                <span className="text-xs text-slate-500">{item.estimated_hours}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{item.reason}</p>
              <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-300"><BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300" />{item.resource}</p>
              </div>
            </div>
            {item.lesson_link && <a href={item.lesson_link} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-semibold text-brand-300 hover:text-white">Explore lesson <ArrowRight className="inline h-3.5 w-3.5" /></a>}
          </article>
        )) : (
          <div className="glass-panel rounded-2xl p-5 text-sm text-slate-300">No study topics were generated. You can review your career goal or upload a clearer resume.</div>
        )}
      </section>

      <section className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white">Practice questions for your gaps</h3>
          <p className="mt-1 text-xs text-slate-400">Questions are shown only when the question bank has a matching topic.</p>
        </div>
        {report.practice_questions?.length ? (
          <ol className="space-y-3">
            {report.practice_questions.map((question, index) => (
              <li key={question.id || index} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-sm text-slate-200">{question.question}</p>
                <p className="mt-1 text-[11px] text-slate-500">{[question.subject, question.topic, question.difficulty].filter(Boolean).join(' · ')}</p>
              </li>
            ))}
          </ol>
        ) : <p className="text-xs text-slate-500">There are no matching questions in the question bank yet.</p>}
      </section>
    </div>
  );
};

export default ResumeLearningReport;
