import React, { useEffect, useState } from 'react';
import { careerService } from '../../services/careerService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SkillBadge from '../../components/SkillBadge';
import { Target, Award, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareerRecommendations = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const res = await careerService.getRecommendedCareers();
        setCareers(res || []);
      } catch (err) {
        setError(err.message || 'Failed to calculate career matches');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  if (loading) return <LoadingSpinner message="Comparing your profile skills with career requirements..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="h-6 w-6 text-brand-400" /> Career Match Engine
        </h1>
        <p className="text-xs text-slate-400">Estimated overlap between the skills in your profile and each role’s listed requirements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map((c) => (
          <div key={c.id || c.title} className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between glass-panel-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{c.title}</h3>
                <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 font-extrabold text-sm">
                  {c.match_percentage == null ? 'Not assessed' : `${c.match_percentage}% Match`}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Required Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {c.required_skills?.map((s, idx) => (
                    <SkillBadge key={idx} skill={s} />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Difficulty: {c.difficulty || 'Medium'}</span>
              <Link
                to={`/skill-gap?target=${encodeURIComponent(c.title)}`}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                Inspect Skill Gap <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerRecommendations;
