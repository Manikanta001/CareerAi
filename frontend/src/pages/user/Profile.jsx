import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import SkillBadge from '../../components/SkillBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Save, Plus } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authService.getProfile();
        setProfile(res);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!profile.technical_skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        technical_skills: [...prev.technical_skills, newSkill.trim()]
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      technical_skills: prev.technical_skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await authService.updateProfile(profile);
      setSuccess('Profile updated successfully!');
      if (profile.name) {
        setUser(prev => ({ ...prev, name: profile.name }));
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading user profile..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Profile</h1>
          <p className="text-xs text-slate-400">Manage your educational background and technical skills</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="h-4 w-4 text-brand-400" /> Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-name" className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                id="profile-name"
                type="text"
                value={profile?.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="text-xs font-semibold text-slate-300">Email Address (Read-only)</label>
              <input
                id="profile-email"
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900/50 border border-slate-800/80 text-slate-400 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="text-xs font-semibold text-slate-300">Phone Number</label>
              <input
                id="profile-phone"
                type="text"
                value={profile?.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="profile-location" className="text-xs font-semibold text-slate-300">Location</label>
              <input
                id="profile-location"
                type="text"
                value={profile?.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <GraduationCap className="h-4 w-4 text-brand-400" /> Education & College
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-education" className="text-xs font-semibold text-slate-300">Degree & Branch</label>
              <input
                id="profile-education"
                type="text"
                value={profile?.education || ''}
                onChange={(e) => handleChange('education', e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="profile-college" className="text-xs font-semibold text-slate-300">College / University</label>
              <input
                id="profile-college"
                type="text"
                value={profile?.college || ''}
                onChange={(e) => handleChange('college', e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="profile-graduation-year" className="text-xs font-semibold text-slate-300">Graduation Year</label>
              <input
                id="profile-graduation-year"
                type="number"
                value={profile?.graduation_year ?? ''}
                onChange={(e) => handleChange('graduation_year', e.target.value === '' ? null : parseInt(e.target.value, 10))}
                min="1950"
                max={new Date().getFullYear() + 8}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label htmlFor="profile-cgpa" className="text-xs font-semibold text-slate-300">CGPA / Percentage</label>
              <input
                id="profile-cgpa"
                type="number"
                step="0.1"
                value={profile?.cgpa ?? ''}
                onChange={(e) => handleChange('cgpa', e.target.value === '' ? null : parseFloat(e.target.value))}
                min="0"
                max="100"
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Briefcase className="h-4 w-4 text-brand-400" /> Technical Skills & Preferences
          </h3>

          <div>
            <label htmlFor="profile-new-skill" className="text-xs font-semibold text-slate-300">Add Technical Skill</label>
            <div className="flex gap-2 mt-1">
              <input
                id="profile-new-skill"
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g. React, Docker, PyTorch"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Skill
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {profile?.technical_skills?.map((s, idx) => (
              <SkillBadge key={idx} skill={s} onRemove={() => handleRemoveSkill(s)} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label htmlFor="profile-career" className="text-xs font-semibold text-slate-300">Target Career Role</label>
              <select
                id="profile-career"
                value={profile?.preferred_career || 'Software Developer'}
                onChange={(e) => handleChange('preferred_career', e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="Software Developer">Software Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/20 transition-all flex items-center gap-2"
        >
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
