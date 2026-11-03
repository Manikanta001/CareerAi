import React, { useEffect, useState } from 'react';
import { careerService } from '../../services/careerService';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Target, Plus, Trash2 } from 'lucide-react';

const AdminCareers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await careerService.getAllCareers();
      setCareers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    try {
      await api.post('/admin/careers', {
        title,
        description,
        required_skills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferred_skills: [],
        difficulty: 'Medium'
      });
      setTitle('');
      setDescription('');
      setRequiredSkills('');
      fetchCareers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this career profile?")) return;
    try {
      await api.delete(`/admin/careers/${id}`);
      fetchCareers();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading career profiles..." />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="h-6 w-6 text-amber-400" /> Manage Career Profiles
        </h1>
      </div>

      {/* Add Career Form */}
      <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white">Add New Career Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Career Title (e.g. Java Developer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <input
            type="text"
            placeholder="Required Skills (comma separated)"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
        </div>
        <textarea
          rows={2}
          placeholder="Career Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Career Profile
        </button>
      </form>

      {/* Career List */}
      <div className="space-y-4">
        {careers.map((c) => (
          <div key={c.id || c.title} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{c.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{c.description}</p>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
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

export default AdminCareers;
