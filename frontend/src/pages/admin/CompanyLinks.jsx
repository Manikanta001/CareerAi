import React, { useEffect, useState } from 'react';
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';

export default function AdminCompanyLinks() {
  const [links, setLinks] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const refresh = async () => { try { const result = await api.get('/admin/company-links'); setLinks(result.data || []); } catch (err) { setError(err.message || 'Could not load company links'); } };
  useEffect(() => { refresh(); }, []);
  const add = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await api.post('/admin/company-links', { name, url, description }); setName(''); setUrl(''); setDescription(''); await refresh(); }
    catch (err) { setError(err.message || 'Could not save company link'); }
    finally { setBusy(false); }
  };
  const remove = async (link) => {
    if (!window.confirm(`Remove the ${link.name} link?`)) return;
    try { await api.delete(`/admin/company-links/${link.id}`); setLinks((items) => items.filter((item) => item.id !== link.id)); }
    catch (err) { setError(err.message || 'Could not remove link'); }
  };
  return <div className="mx-auto max-w-4xl space-y-6">
    <header><h1 className="text-2xl font-bold text-white">Company links</h1><p className="mt-1 text-sm text-slate-400">Share official careers and application pages with every student.</p></header>
    {error && <ErrorMessage message={error} />}
    <form onSubmit={add} className="glass-panel space-y-4 rounded-2xl p-5">
      <h2 className="font-bold text-white">Add a company link</h2>
      <div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-xs text-slate-300">Company name<input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" /></label><label className="space-y-1 text-xs text-slate-300">Careers or application URL<input required type="url" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" /></label></div>
      <label className="block space-y-1 text-xs text-slate-300">Description (optional)<input maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white" /></label>
      <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"><Plus className="h-4 w-4" />{busy ? 'Saving…' : 'Publish link'}</button>
    </form>
    <section className="space-y-3">{links.map((link) => <article key={link.id} className="glass-panel flex items-center justify-between gap-4 rounded-xl p-4"><div className="min-w-0"><h3 className="font-bold text-white">{link.name}</h3>{link.description && <p className="mt-1 text-sm text-slate-400">{link.description}</p>}<a href={link.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-blue-400 hover:underline">{link.url}<ExternalLink className="h-3 w-3 shrink-0" /></a></div><button onClick={() => remove(link)} aria-label={`Remove ${link.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button></article>)}{links.length === 0 && <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">No company links published.</p>}</section>
  </div>;
}
