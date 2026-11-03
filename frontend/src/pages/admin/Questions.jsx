import React, { useEffect, useState } from 'react';
import { questionService } from '../../services/questionService';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ListOrdered, Plus, Trash2 } from 'lucide-react';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState('DBMS');
  const [topic, setTopic] = useState('SQL');
  const [questionText, setQuestionText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correct, setCorrect] = useState(0);
  const [explanation, setExplanation] = useState('');

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await questionService.getQuestions();
      setQuestions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!questionText || !opt0 || !opt1) return;
    try {
      await api.post('/admin/questions', {
        subject,
        topic,
        difficulty: 'Medium',
        question: questionText,
        options: [opt0, opt1, opt2 || 'Option C', opt3 || 'Option D'],
        correct_answer: parseInt(correct),
        explanation: explanation || 'Standard concept explanation',
        marks: 1
      });
      setQuestionText('');
      setOpt0('');
      setOpt1('');
      setOpt2('');
      setOpt3('');
      setExplanation('');
      fetchQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete question from question bank?")) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Question Bank..." />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ListOrdered className="h-6 w-6 text-amber-400" /> Manage Question Bank
        </h1>
      </div>

      <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white">Add New MCQ to Question Bank</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Subject (e.g. DBMS)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <input
            type="text"
            required
            placeholder="Topic (e.g. SQL Joins)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <textarea
          rows={2}
          required
          placeholder="Question Statement..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
        />

        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Option A" value={opt0} onChange={(e) => setOpt0(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
          <input type="text" placeholder="Option B" value={opt1} onChange={(e) => setOpt1(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
          <input type="text" placeholder="Option C" value={opt2} onChange={(e) => setOpt2(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
          <input type="text" placeholder="Option D" value={opt3} onChange={(e) => setOpt3(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white" />
        </div>

        <div>
          <label className="text-xs text-slate-300 mr-3">Correct Option Index (0 = A, 1 = B, 2 = C, 3 = D):</label>
          <select value={correct} onChange={(e) => setCorrect(e.target.value)} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white">
            <option value={0}>Option A (0)</option>
            <option value={1}>Option B (1)</option>
            <option value={2}>Option C (2)</option>
            <option value={3}>Option D (3)</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Question
        </button>
      </form>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="glass-panel p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-400">{q.subject} • {q.topic}</span>
              <h4 className="text-sm font-bold text-white">{q.question}</h4>
            </div>
            <button
              onClick={() => handleDelete(q.id)}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQuestions;
