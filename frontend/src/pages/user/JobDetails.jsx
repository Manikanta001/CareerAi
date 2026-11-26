import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, ExternalLink, MapPin } from 'lucide-react';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SkillBadge from '../../components/SkillBadge';
import { getSafeExternalUrl } from '../../utils/helpers';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setJob(null);
    jobService.getJobById(id)
      .then((result) => active && setJob(result || null))
      .catch((err) => active && setError(err.message || 'Could not load this role.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading role details…" />;
  if (error) return <ErrorMessage message={error} />;
  if (!job) return <ErrorMessage message="This role could not be found." />;

  const applicationUrl = getSafeExternalUrl(job.application_url);

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">
        <ArrowLeft className="h-4 w-4" /> Back to matched roles
      </Link>
      <header className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300"><Briefcase className="h-4 w-4" /> Career opportunity</p>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{job.title}</h1>
            {job.is_sample && <span className="mt-2 inline-flex rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-200">Sample role · not a live vacancy</span>}
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4 text-brand-300" />{job.company}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-300" />{job.location}</span>
              {job.experience && <span>{job.experience}</span>}
            </p>
          </div>
          {applicationUrl ? <a href={applicationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300">Visit application <ExternalLink className="h-4 w-4" /></a> : <span className="rounded-xl border border-slate-700 px-4 py-3 text-center text-xs text-slate-400">Application link unavailable</span>}
        </div>
      </header>
      {job.description && <section className="glass-panel rounded-2xl p-6"><h2 className="text-base font-bold text-white">About the role</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">{job.description}</p></section>}
      {job.responsibilities?.length > 0 && <section className="glass-panel rounded-2xl p-6"><h2 className="text-base font-bold text-white">Responsibilities</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">{job.responsibilities.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></section>}
      {job.eligibility && <section className="glass-panel rounded-2xl p-6"><h2 className="text-base font-bold text-white">Eligibility</h2><p className="mt-3 text-sm leading-6 text-slate-300">{job.eligibility}</p></section>}
      {job.required_skills?.length > 0 && <section className="glass-panel rounded-2xl p-6"><h2 className="text-base font-bold text-white">Skills for this role</h2><div className="mt-3 flex flex-wrap gap-2">{job.required_skills.map((skill) => <SkillBadge key={skill} skill={skill} />)}</div></section>}
    </article>
  );
};

export default JobDetails;
