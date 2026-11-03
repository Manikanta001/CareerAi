import React, { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SkillBadge from '../../components/SkillBadge';
import { Briefcase, MapPin, Building2, ExternalLink } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await jobService.getRecommendedJobs();
        setJobs(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load matching jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <LoadingSpinner message="Matching student skill profile with job catalog..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-brand-400" /> Placement Job Matcher
        </h1>
        <p className="text-xs text-slate-400">Sample job database matched with your verified technical skills</p>
      </div>

      <div className="space-y-6">
        {jobs.map((job) => (
          <div key={job.id} className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{job.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-300">
                    <Building2 className="h-3.5 w-3.5 text-brand-400" /> {job.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
                  </span>
                  <span>•</span>
                  <span>{job.experience}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm">
                  {job.match_percentage || 85}% Match
                </span>
                <a
                  href={job.application_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  Apply <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Matched Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {job.matched_skills?.map((s, idx) => (
                    <SkillBadge key={idx} skill={s} status="Strong" />
                  ))}
                </div>
              </div>

              {job.missing_skills?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">Missing Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.missing_skills?.map((s, idx) => (
                      <SkillBadge key={idx} skill={s} status="Missing" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
