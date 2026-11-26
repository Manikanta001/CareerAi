import React, { useEffect, useState } from 'react';
import { Megaphone, Send, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminUpdates() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const refresh = async () => { try { const result = await api.get('/admin/announcements'); setItems(result.data || []); } catch (err) { setError(err.message || 'Could not load updates'); } };
  useEffect(() => { refresh(); }, []);
  const publish = async (event) => {
    event.preventDefault(); setError(''); setSuccess(''); setBusy(true);
    try { await api.post('/admin/announcements', { title, body }); setTitle(''); setBody(''); setSuccess('Published. The update is now visible to all signed-in users.'); await refresh(); }
    catch (err) { setError(err.message || 'Could not publish update'); }
    finally { setBusy(false); }
  };
  const remove = async (item) => {
    if (!window.confirm(`Remove “${item.title}” from users' updates?`)) return;
    try { await api.delete(`/admin/announcements/${item.id}`); setItems((all) => all.filter((entry) => entry.id !== item.id)); }
    catch (err) { setError(err.message || 'Could not remove update'); }
  };
  return <div className="mx-auto max-w-4xl space-y-6">
    <header className="flex items-center gap-3"><span className="rounded-xl bg-blue-100 p-3 text-blue-700"><Megaphone className="h-5 w-5" /></span><div><h1 className="text-2xl font-bold text-white">Student updates</h1><p className="mt-1 text-sm text-slate-400">Publish announcements that appear in every signed-in student's dashboard.</p></div></header>
    {error && <ErrorMessage message={error} />}{success && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{success}</p>}
    <form onSubmit={publish} className="glass-panel space-y-4 rounded-2xl p-5"><label className="block text-xs text-slate-300">Update title<input required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" /></label><label className="block text-xs text-slate-300">Message<textarea required maxLength={2000} rows={4} value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" /></label><button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"><Send className="h-4 w-4" />{busy ? 'Publishing…' : 'Publish to all users'}</button></form>
    <section className="space-y-3">{items.map((item) => <article key={item.id} className="glass-panel flex items-start justify-between gap-4 rounded-xl p-4"><div><h2 className="font-bold text-white">{item.title}</h2><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.body}</p><p className="mt-2 text-xs text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleString() : 'Published update'}</p></div><button onClick={() => remove(item)} aria-label={`Remove ${item.title}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button></article>)}{items.length === 0 && <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">No updates have been published.</p>}</section>
  </div>;
}
