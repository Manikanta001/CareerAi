import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import api from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Updates() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { api.get('/updates').then((res) => setItems(res.data || [])).catch((err) => setError(err.message || 'Could not load updates')).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingSpinner message="Loading CareerAI updates…" />;
  return <div className="mx-auto max-w-4xl space-y-5"><header><h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900"><Megaphone className="h-6 w-6 text-blue-600" />CareerAI updates</h1><p className="mt-1 text-sm text-slate-600">Announcements and new resources from your placement team.</p></header>{error && <ErrorMessage message={error} />}{items.map((item) => <article key={item.id} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">{item.title}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.body}</p><time className="mt-3 block text-xs text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</time></article>)}{!items.length && !error && <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No updates yet. New announcements will appear here.</p>}</div>;
}
