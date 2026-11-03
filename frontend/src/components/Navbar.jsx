import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, LogOut, ShieldCheck, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-brand-500" />
          </div>
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-500 bg-clip-text text-transparent">
            Career<span className="text-brand-500">AI</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-2 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
            PRO PLATFORM
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all">
                <ShieldCheck className="h-4 w-4" /> Admin Panel
              </Link>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-200 hover:text-white transition-colors">
                <div className="h-8 w-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline font-medium">{user.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-lg shadow-md shadow-brand-600/20 transition-all">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
