import React, { useEffect, useState } from 'react';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/careers');
      setCareers(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load career profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim() || !description.trim() || !requiredSkills.trim()) {
      setError('Enter a title, description, and at least one required skill.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/careers', {
        title: title.trim(),
        description: description.trim(),
        required_skills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferred_skills: [],
        difficulty: 'Medium'
      });
      setTitle('');
      setDescription('');
      setRequiredSkills('');
      await fetchCareers();
      setSuccess('Career profile added.');
    } catch (err) {
      setError(err.message || 'Could not add this career profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this career profile?")) return;
    try {
      await api.delete(`/admin/careers/${id}`);
      await fetchCareers();
    } catch (err) {
      setError(err.message || 'Could not delete this career profile.');
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

      {error && <ErrorMessage message={error} />}
      {success && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{success}</p>}

      {/* Add Career Form */}
      <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white">Add New Career Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            aria-label="Career title"
            placeholder="Career Title (e.g. Java Developer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <input
            type="text"
            required
            aria-label="Required skills"
            placeholder="Required Skills (comma separated)"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
        </div>
        <textarea
          rows={2}
          required
          aria-label="Career description"
          placeholder="Career Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> {saving ? 'Saving…' : 'Add Career Profile'}
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
              type="button"
              aria-label={`Delete ${c.title}`}
              onClick={() => handleDelete(c.id)}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {!careers.length && !error && <p className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">No career profiles have been added yet.</p>}
      </div>
    </div>
  );
};

export default AdminCareers;
