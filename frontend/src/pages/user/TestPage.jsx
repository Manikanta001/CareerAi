import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testService } from '../../services/testService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import QuestionCard from '../../components/QuestionCard';
import Timer from '../../components/Timer';
import { CheckCircle2, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTestData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await testService.getTestDetails(testId);
      setTest(res);
      setQuestions(res?.questions || []);
      setUserAnswers({});
      setMarkedForReview({});
      setCurrentIndex(0);
      setStartTime(Date.now());
    } catch (err) {
      setError(err.message || 'Failed to load test payload');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestData(); }, [testId]);

  const handleSelectOption = (optIndex) => {
    const qid = questions[currentIndex]?.id;
    if (qid) {
      setUserAnswers(prev => ({ ...prev, [qid]: optIndex }));
    }
  };

  const handleClearAnswer = () => {
    const qid = questions[currentIndex]?.id;
    if (qid) {
      setUserAnswers(prev => {
        const next = { ...prev };
        delete next[qid];
        return next;
      });
    }
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError('');

    const durationSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    try {
      const fullAnswers = {};
      questions.forEach(q => {
        fullAnswers[q.id] = userAnswers[q.id] !== undefined ? userAnswers[q.id] : -1;
      });
      const res = await testService.submitTest(testId, fullAnswers, durationSeconds);
      navigate('/test-result', { state: { result: res } });
    } catch (err) {
      setError(err.message || 'Failed to submit test');
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Initializing placement test environment & timer..." />;
  if (error) return <ErrorMessage message={error} onRetry={test ? handleSubmitTest : fetchTestData} />;
  if (!questions.length) return <ErrorMessage message="This test has no questions available." />;

  const currentQ = questions[currentIndex];
  const durationInSeconds = (test?.duration_minutes || 60) * 60;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Test Navigation Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">{test?.title}</h2>
          <span className="text-xs text-slate-400">Total Questions: {questions.length}</span>
        </div>

        <div className="flex items-center gap-4">
          <Timer initialSeconds={durationInSeconds} onExpire={handleSubmitTest} />
          <button
            type="button"
            onClick={handleSubmitTest}
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
          >
            {submitting ? 'Evaluating...' : 'Submit Test'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3 space-y-6">
          <QuestionCard
            question={currentQ}
            questionIndex={currentIndex}
            selectedAnswer={currentQ ? userAnswers[currentQ.id] : undefined}
            onSelectAnswer={handleSelectOption}
            showExplanation={false}
          />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={toggleMarkForReview}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  markedForReview[currentIndex]
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" /> {markedForReview[currentIndex] ? 'Marked' : 'Mark for Review'}
              </button>
              {currentQ && userAnswers[currentQ.id] !== undefined && (
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Clear Choice
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white border border-brand-500 disabled:opacity-50"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="glass-panel p-5 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Palette</h3>
          
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isMarked = markedForReview[idx];
              const isCurrent = currentIndex === idx;

              let btnBg = 'bg-slate-900 border-slate-800 text-slate-400';
              if (isCurrent) btnBg = 'ring-2 ring-brand-500 bg-brand-500/20 text-white font-bold';
              else if (isAnswered) btnBg = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold';
              else if (isMarked) btnBg = 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold';

              return (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to question ${idx + 1}${isAnswered ? ', answered' : ''}${isMarked ? ', marked for review' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-xl border text-xs font-mono transition-all flex items-center justify-center ${btnBg}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500/40 inline-block" /> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500/40 inline-block" /> Marked for Review
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-800 inline-block" /> Unanswered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
