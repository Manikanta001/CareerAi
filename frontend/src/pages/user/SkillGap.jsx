import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { careerService } from '../../services/careerService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SkillBadge from '../../components/SkillBadge';
import { Award, BookOpen, Clock, Code2, CheckCircle2 } from 'lucide-react';

const SkillGap = () => {
  const [searchParams] = useSearchParams();
  const targetFromUrl = searchParams.get('target');

  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGap = async () => {
      try {
        setLoading(true);
        const res = await careerService.getSkillGaps(targetFromUrl || 'Software Developer');
        setGapData(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load skill gap matrix');
      } finally {
        setLoading(false);
      }
    };
    fetchGap();
  }, [targetFromUrl]);

  if (loading) return <LoadingSpinner message="Analyzing target career requirements vs candidate skills..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-brand-400" /> Skill Gap Matrix
          </h1>
          <p className="text-xs text-slate-400">Target Role: <span className="text-brand-400 font-bold">{gapData?.target_career}</span></p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">Target Readiness</span>
          <span className="text-lg font-extrabold text-brand-400">{gapData?.readiness_percentage}%</span>
        </div>
      </div>

      {/* Gap Analysis Table / List */}
      <div className="space-y-4">
        {gapData?.gap_analysis?.map((item, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-white">{item.skill}</span>
                <SkillBadge skill={item.skill} status={item.status} />
              </div>
              <span className="text-xs text-slate-400 font-medium">Importance: {item.importance}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Resource</div>
                  <div>{item.recommended_resource}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Time</div>
                  <div>{item.estimated_learning_time}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Recommended Project</div>
                  <div>{item.related_project}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillGap;
