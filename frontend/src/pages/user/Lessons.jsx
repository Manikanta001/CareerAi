import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { questionService } from '../../services/questionService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';

const Lessons = () => {
  const { topicId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const result = await questionService.getTopicLessons(topicId);
        setLessons(result || []);
      } catch (err) {
        setError(err.message || 'Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };
    loadLessons();
  }, [topicId]);

  if (loading) return <LoadingSpinner message="Loading topic lessons..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-brand-400" /> Topic Lessons
        </h1>
        <p className="text-xs text-slate-400">Work through each lesson, then practise the topic with MCQs.</p>
      </div>

      {lessons.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center text-sm text-slate-400">
          No lessons have been published for this topic yet.
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={lesson.id || index} className="glass-panel p-6 rounded-2xl flex items-center justify-between gap-4 glass-panel-hover">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-brand-400 mb-1">Lesson {index + 1}</div>
                <h2 className="text-base font-bold text-white">{lesson.title}</h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {lesson.estimated_time || 'Self-paced'}</span>
                  <span>{lesson.difficulty || 'Medium'}</span>
                </div>
              </div>
              <Link to={`/lessons/${lesson.id}?topic_id=${encodeURIComponent(topicId)}&topic_title=${encodeURIComponent(lesson.topic_title || lesson.topic || lesson.title)}`} className="shrink-0 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1">
                Open <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lessons;
