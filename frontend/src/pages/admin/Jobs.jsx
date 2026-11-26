import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('0-2 years');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/jobs');
      setJobs(res.data || []);
    } catch (err) {
      setError(err.message || 'Could not load job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !company.trim() || !description.trim() || !requiredSkills.trim()) {
      setError('Enter a title, company, description, and at least one required skill.');
      return;
    }
    if (applicationUrl && !/^https?:\/\//i.test(applicationUrl)) {
      setError('Application link must start with http:// or https://.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/jobs', {
        title: title.trim(),
        company: company.trim(),
        location: location.trim() || 'Remote',
        experience: experience.trim(),
        required_skills: requiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean),
        description: description.trim(),
        application_url: applicationUrl.trim()
      });
      setTitle('');
      setCompany('');
      setLocation('');
      setExperience('0-2 years');
      setDescription('');
      setRequiredSkills('');
      setApplicationUrl('');
      await fetchJobs();
    } catch (err) {
      setError(err.message || 'Could not create this job listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete job posting?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      await fetchJobs();
    } catch (err) {
      setError(err.message || 'Could not delete this job listing.');
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

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleAdd} className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white">Create Job Listing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="sr-only" htmlFor="job-title">Job title</label><input
            id="job-title"
            type="text"
            required
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <label className="sr-only" htmlFor="job-company">Company name</label><input
            id="job-company"
            type="text"
            required
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <label className="sr-only" htmlFor="job-location">Location</label><input
            id="job-location"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500"
          />
          <label className="sr-only" htmlFor="job-experience">Experience level</label><input id="job-experience" type="text" placeholder="Experience (e.g. 0-2 years)" value={experience} onChange={(e) => setExperience(e.target.value)} className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500" />
          <label className="sr-only" htmlFor="job-required-skills">Required skills</label><input id="job-required-skills" type="text" required placeholder="Required skills (comma separated)" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500" />
          <label className="sr-only" htmlFor="job-application-url">Application URL</label><input id="job-application-url" type="url" placeholder="Application URL (optional)" value={applicationUrl} onChange={(e) => setApplicationUrl(e.target.value)} className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500" />
        </div>
        <label className="sr-only" htmlFor="job-description">Job description</label><textarea id="job-description" rows={3} required placeholder="Describe the role and its responsibilities" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none" />
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> {saving ? 'Saving…' : 'Add Job Listing'}
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
              type="button"
              aria-label={`Delete ${j.title}`}
              onClick={() => handleDelete(j.id)}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {!jobs.length && !error && <p className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">No job listings yet. Add your first role above.</p>}
      </div>
    </div>
  );
};

export default AdminJobs;
