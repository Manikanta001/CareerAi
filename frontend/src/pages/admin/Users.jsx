import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { User, ShieldCheck, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (person) => {
    const role = person.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change ${person.name}'s role to ${role}?`)) return;
    setBusyId(person.id);
    setError('');
    try {
      await api.patch(`/admin/users/${person.id}/role`, { role });
      await loadUsers();
    } catch (err) { setError(err.message || 'Could not update role'); }
    finally { setBusyId(''); }
  };

  const removeUser = async (person) => {
    if (!window.confirm(`Permanently delete ${person.name}'s account and profile?`)) return;
    setBusyId(person.id);
    setError('');
    try {
      await api.delete(`/admin/users/${person.id}`);
      setUsers((all) => all.filter((entry) => entry.id !== person.id));
    } catch (err) { setError(err.message || 'Could not delete user'); }
    finally { setBusyId(''); }
  };

  if (loading) return <LoadingSpinner message="Loading user directory..." />;
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="h-6 w-6 text-amber-400" /> Manage Registered Users
        </h1>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between"><p className="text-sm text-slate-400">{users.length} accounts</p><button onClick={loadUsers} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"><RefreshCw className="h-3.5 w-3.5" />Refresh</button></div>
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-white">{u.name}</div>
                <div className="text-slate-400">{u.email}</div>
              </div>
              <div className="flex items-center gap-2"><span className={`px-2.5 py-0.5 rounded font-bold uppercase text-[10px] ${u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-brand-500/20 text-brand-300'}`}>{u.role}</span>
                {u.id !== currentUser?.id && <><button type="button" disabled={busyId === u.id} onClick={() => changeRole(u)} className="rounded-lg border border-slate-700 px-2.5 py-1.5 font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-50">{busyId === u.id ? 'Saving…' : u.role === 'ADMIN' ? 'Make user' : 'Make admin'}</button><button type="button" disabled={busyId === u.id} onClick={() => removeUser(u)} aria-label={`Delete ${u.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></>}
              </div>
            </div>
          ))}
          {!users.length && <p className="py-8 text-center text-sm text-slate-400">No accounts found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
