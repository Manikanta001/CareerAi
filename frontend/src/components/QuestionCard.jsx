import React from 'react';

const QuestionCard = ({ question, questionIndex, selectedAnswer, onSelectAnswer, showExplanation = false }) => {
  if (!question) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
          Question {questionIndex + 1}
        </span>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {question.subject}
          </span>
          <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {question.topic}
          </span>
          <span className={`px-2.5 py-0.5 rounded font-medium ${
            question.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
            question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
            'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
        {question.question}
      </h3>

      <div className="space-y-2.5 pt-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = showExplanation && idx === question.correct_answer;
          const isWrong = showExplanation && isSelected && idx !== question.correct_answer;

          let btnStyle = "border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700";
          if (showExplanation) {
            if (isCorrect) btnStyle = "border-emerald-500/50 bg-emerald-500/15 text-emerald-200 font-semibold";
            else if (isWrong) btnStyle = "border-rose-500/50 bg-rose-500/15 text-rose-200 font-semibold";
          } else if (isSelected) {
            btnStyle = "border-brand-500 bg-brand-500/20 text-white font-semibold shadow-md shadow-brand-500/10";
          }

          return (
            <button
              key={idx}
              disabled={showExplanation}
              onClick={() => onSelectAnswer && onSelectAnswer(idx)}
              className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-center justify-between transition-all ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && question.explanation && (
        <div className="mt-4 p-4 rounded-xl bg-brand-950/40 border border-brand-500/30 text-xs text-brand-200 space-y-1">
          <div className="font-bold text-brand-400 uppercase tracking-wider">Explanation</div>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
