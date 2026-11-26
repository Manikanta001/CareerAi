import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { questionService } from '../../services/questionService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { BookOpen, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

const Topics = () => {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const res = await questionService.getSubjectTopics(subjectId || 'sub1');
        setTopics(res || []);
      } catch (err) {
        setError(err.message || 'Failed to load topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [subjectId]);

  if (loading) return <LoadingSpinner message="Loading subject topics..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-brand-400" /> Subject Topics Roadmap
        </h1>
        <p className="text-xs text-slate-400">Complete topics sequentially to build conceptual mastery</p>
      </div>

      <div className="space-y-4">
        {topics.map((t, idx) => {
          const isCompleted = t.status === 'Completed';
          const isLocked = t.status === 'Locked';

          return (
            <div
              key={t.id || idx}
              className={`glass-panel p-6 rounded-2xl flex items-center justify-between transition-all ${
                isLocked ? 'opacity-60' : 'glass-panel-hover'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  isLocked ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                  'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-5 w-5" /> : (idx + 1)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{t.title}</h3>
                  <span className="text-xs text-slate-400 font-medium">Difficulty: {t.difficulty || 'Medium'}</span>
                </div>
              </div>

              {!isLocked ? (
                <Link
                  to={`/topics/${t.id}/lessons`}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all flex items-center gap-1"
                >
                  Start Lesson <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="text-xs font-semibold text-slate-400">Locked</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Topics;
