import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { questionService } from '../../services/questionService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { BookOpen, CheckCircle2, AlertTriangle, Lightbulb, HelpCircle } from 'lucide-react';

const Lesson = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await questionService.getLesson(lessonId || 'les1');
        setLesson(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load lesson content');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (loading) return <LoadingSpinner message="Loading interactive lesson content..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
          {lesson?.subject} • {lesson?.topic}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{lesson?.title}</h1>
      </div>

      {/* Main Explanation */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Concept Explanation</h3>
          <p className="text-sm text-slate-200 leading-relaxed">{lesson?.explanation}</p>
        </div>

        {/* Key Concepts List */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Key Concepts</h3>
          <div className="space-y-2">
            {lesson?.key_concepts?.map((concept, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes */}
        {lesson?.common_mistakes?.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Common Mistakes
            </h3>
            <ul className="list-disc list-inside text-xs text-amber-200 space-y-1">
              {lesson.common_mistakes.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <Link
            to="/mcq-practice"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/20 transition-all flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" /> Practice Topic MCQs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
