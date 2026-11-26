import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, ShieldCheck } from 'lucide-react';
import BrandMark from './BrandMark';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm shadow-slate-200/60">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
        <BrandMark />
        <div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Career<span className="text-blue-600">AI</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-slate-500 ml-2 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100">
            CAREER GROWTH
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
                type="button"
                aria-label="Sign out"
                title="Sign out"
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
