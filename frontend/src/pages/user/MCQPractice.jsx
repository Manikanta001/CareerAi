import React, { useEffect, useState } from 'react';
import { questionService } from '../../services/questionService';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import QuestionCard from '../../components/QuestionCard';
import { HelpCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

const MCQPractice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  const [subject, setSubject] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await questionService.getQuestions(subject, 'All', difficulty);
      setQuestions(res.data || []);
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
  }, [subject, difficulty]);

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    setShowExplanations(prev => ({ ...prev, [currentIndex]: true }));
  };

  if (loading) return <LoadingSpinner message="Fetching MCQ practice questions..." />;

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-brand-400" /> MCQ Practice Engine
          </h1>
          <p className="text-xs text-slate-400">Interactive questions with instant answer explanations</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Subjects</option>
            <option value="Quantitative Aptitude">Quantitative Aptitude</option>
            <option value="DBMS">DBMS</option>
            <option value="Java">Java</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="Data Structures">Data Structures</option>
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

      {error && <ErrorMessage message={error} />}

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
