import React, { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getAllJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !company) return;
    try {
      await api.post('/admin/jobs', {
        title,
        company,
        location: location || 'Remote',
        experience: '0-2 years',
        required_skills: ['Java', 'Python', 'SQL'],
        description: 'Building software solutions',
        application_url: '#'
      });
      setTitle('');
      setCompany('');
      setLocation('');
      fetchJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete job posting?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job database..." />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-amber-400" /> Manage Job Postings
        </h1>
      </div>

      <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white">Create Job Listing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            required
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <input
            type="text"
            required
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Job Listing
        </button>
      </form>

      <div className="space-y-4">
        {jobs.map((j) => (
          <div key={j.id} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">{j.title}</h3>
              <p className="text-xs text-slate-400">{j.company} • {j.location}</p>
            </div>
            <button
              onClick={() => handleDelete(j.id)}
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

export default AdminJobs;
