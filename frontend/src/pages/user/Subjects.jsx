import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../../services/questionService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ProgressBar from '../../components/ProgressBar';
import { BookOpen, ChevronRight, Layers } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        setLoading(true);
        const res = await questionService.getSubjects();
        setSubjects(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load placement subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  if (loading) return <LoadingSpinner message="Loading placement curriculum & subjects..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-brand-400" /> Placement Learning Center
        </h1>
        <p className="text-xs text-slate-400">Structured lessons across Quantitative Aptitude, Reasoning, Verbal, and CS core</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => (
          <div key={sub.id} className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col justify-between glass-panel-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded border border-brand-500/20">
                  {sub.category || 'General'}
                </span>
                <span className="text-xs text-slate-400 font-medium">{sub.topics_count || 10} Topics</span>
              </div>

              <h3 className="text-lg font-bold text-white">{sub.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{sub.description}</p>

              <div className="pt-2">
                <ProgressBar value={sub.progress_percentage || 65} label="Subject Mastery" color="brand" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Link
                to={`/subjects/${sub.id}/topics`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1"
              >
                View Topics <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
