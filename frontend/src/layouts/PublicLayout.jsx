import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 CareerAI — AI-Powered Career Intelligence & Placement Preparation Platform</div>
          <div className="flex gap-6 text-slate-400">
            <span>Built for B.Tech & Job Seekers</span>
            <span>FastAPI + React + MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
