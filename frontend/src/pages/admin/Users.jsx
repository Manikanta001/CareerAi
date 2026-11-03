import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { User, ShieldCheck } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/users');
        setUsers(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <LoadingSpinner message="Loading user directory..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="h-6 w-6 text-amber-400" /> Manage Registered Users
        </h1>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{u.name}</div>
                <div className="text-slate-400">{u.email}</div>
              </div>
              <span className={`px-2.5 py-0.5 rounded font-bold uppercase text-[10px] ${
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

export default AdminUsers;
