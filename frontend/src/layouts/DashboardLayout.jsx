import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const DashboardLayout = () => {
  const [latestUpdate, setLatestUpdate] = useState(null);
  useEffect(() => { api.get('/updates').then((result) => setLatestUpdate(result.data?.[0] || null)).catch(() => {}); }, []);
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      {latestUpdate && <Link to="/updates" className="flex items-start gap-3 border-b border-blue-200 bg-blue-50 px-4 py-3 text-blue-950 sm:px-6 lg:px-8"><Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /><span className="min-w-0 flex-1 truncate text-sm"><strong>New CareerAI update: {latestUpdate.title}</strong><span className="hidden sm:inline"> — {latestUpdate.body}</span></span><span className="shrink-0 text-xs font-bold text-blue-700">View updates →</span></Link>}
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="min-w-0 w-full flex-1 overflow-x-hidden p-4 sm:p-6 md:p-8 lg:mx-auto lg:max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
