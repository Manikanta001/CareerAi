import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { ShieldCheck, User, Target, Briefcase, ListOrdered } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/users');
        setUsers(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load admin metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Admin control panel..." />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-amber-400" /> Admin Control Dashboard
        </h1>
        <p className="text-xs text-slate-400">System management, user control, question bank, and job postings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Registered Users" value={users.length || 2} subtitle="Student accounts" icon={User} color="amber" />
        <StatCard title="Active Careers" value={5} subtitle="Career profiles" icon={Target} color="brand" />
        <StatCard title="Job Postings" value={3} subtitle="Active placements" icon={Briefcase} color="emerald" />
        <StatCard title="Question Bank" value="100+" subtitle="MCQs across subjects" icon={ListOrdered} color="indigo" />
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-white">Registered Users Overview</h3>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{u.name}</div>
                <div className="text-slate-400">{u.email}</div>
              </div>
              <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-brand-500/20 text-brand-300'
              }`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
