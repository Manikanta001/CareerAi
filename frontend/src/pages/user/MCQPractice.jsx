import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { questionService } from '../../services/questionService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import QuestionCard from '../../components/QuestionCard';
import { HelpCircle, RefreshCw, CheckCircle2, RotateCcw, Award } from 'lucide-react';

const ALL_SUBJECTS = [
  'Quantitative Aptitude',
  'Logical Reasoning',
  'Verbal Ability',
  'Data Structures',
  'Python',
  'Java',
  'C',
  'C++',
  'JavaScript',
  'DBMS',
  'SQL',
  'OOP',
  'Software Engineering',
  'Operating Systems',
  'Computer Networks'
];

const MCQPractice = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'All';
  const company = searchParams.get('company') || 'All';
  const companyNames = { tcs: 'TCS', infosys: 'Infosys', accenture: 'Accenture', wipro: 'Wipro', cognizant: 'Cognizant' };
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [subject, setSubject] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [availableSubjects, setAvailableSubjects] = useState(ALL_SUBJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load subjects dynamically if available
  useEffect(() => {
    questionService.getSubjects()
      .then(res => {
        if (res && res.length > 0) {
          const names = res.map(s => s.name || s).filter(Boolean);
          if (names.length > 0) {
            const merged = Array.from(new Set([...names, ...ALL_SUBJECTS]));
            setAvailableSubjects(merged);
          }
        }
      })
      .catch(() => {
        // Fallback to ALL_SUBJECTS
      });
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await questionService.getQuestions(subject, topic, difficulty, company);
      setQuestions(res || []);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowExplanations({});
    } catch (err) {
      setError(err.message || 'Failed to load practice questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [subject, difficulty, topic, company]);

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    setShowExplanations(prev => ({ ...prev, [currentIndex]: true }));
  };

  const handleResetCurrent = () => {
    setSelectedAnswers(prev => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
    setShowExplanations(prev => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  };

  // Stats for the current session
  const attemptedCount = Object.keys(selectedAnswers).length;
  let correctCount = 0;
  Object.entries(selectedAnswers).forEach(([idx, selected]) => {
    const q = questions[parseInt(idx, 10)];
    if (q && selected === q.correct_answer) {
      correctCount += 1;
    }
  });
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  if (loading) return <LoadingSpinner message="Fetching MCQ practice questions..." />;

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-brand-400" /> MCQ Practice Engine
          </h1>
          <p className="text-xs text-slate-400">{company !== 'All' ? `${companyNames[company] || company} pattern-aligned questions with instant explanations` : 'Interactive questions with instant answer explanations'}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {topic !== 'All' && <span className="rounded-xl border border-brand-500/40 bg-brand-500/10 px-3 py-1.5 text-xs text-brand-200">Topic: {topic}</span>}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Subjects ({questions.length || 'All'})</option>
            {availableSubjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Session stats scorecard */}
      {questions.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Answered</div>
            <div className="text-base font-extrabold text-white mt-0.5">{attemptedCount} / {questions.length}</div>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Correct</div>
            <div className="text-base font-extrabold text-emerald-400 mt-0.5">{correctCount}</div>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Accuracy</div>
            <div className="text-base font-extrabold text-brand-400 mt-0.5">{accuracy}%</div>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {company !== 'All' && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">These are original company-pattern practice questions, not verified previous-year questions.</div>}

      {questions.length > 0 && currentQ ? (
        <div className="space-y-6">
          <QuestionCard
            question={currentQ}
            questionIndex={currentIndex}
            selectedAnswer={selectedAnswers[currentIndex]}
            onSelectAnswer={handleSelectOption}
            showExplanation={showExplanations[currentIndex]}
          />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  currentIndex === 0
                    ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
              >
                Previous Question
              </button>

              {selectedAnswers[currentIndex] !== undefined && (
                <button
                  onClick={handleResetCurrent}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Try Again
                </button>
              )}
            </div>

            <span className="text-xs font-bold text-slate-400">
              {currentIndex + 1} of {questions.length}
            </span>

            <button
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentIndex === questions.length - 1
                  ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                  : 'bg-brand-600 hover:bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-600/20'
              }`}
            >
              Next Question
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-sm">
          No questions found matching selected filter criteria.
        </div>
      )}
    </div>
  );
};

export default MCQPractice;
