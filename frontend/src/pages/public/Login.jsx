import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import ErrorMessage from '../../components/ErrorMessage';

const Login = ({ adminMode = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (adminMode && res?.user?.role !== 'ADMIN') {
        logout();
        throw new Error('This account does not have administrator access. Use the student sign-in or contact an administrator.');
      }
      const requestedPath = location.state?.from?.pathname;
      if (res?.user?.role === 'ADMIN') {
        navigate(requestedPath?.startsWith('/admin') ? requestedPath : '/admin', { replace: true });
      } else {
        navigate(requestedPath && !requestedPath.startsWith('/admin') ? requestedPath : '/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          {adminMode && <ShieldCheck className="mx-auto h-5 w-5 text-amber-400" />}
          <h2 className="text-2xl font-bold text-white">{adminMode ? 'Administrator Sign In' : 'Welcome Back'}</h2>
          <p className="text-xs text-slate-400">{adminMode ? 'Sign in with an administrator account to manage CareerAI' : 'Sign in to access your CareerAI placement portal'}</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id={adminMode ? 'admin-login-email' : 'login-email'}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                id={adminMode ? 'admin-login-password' : 'login-password'}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-brand-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl ${adminMode ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-600/20' : 'bg-brand-600 hover:bg-brand-500 shadow-brand-600/20'} text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2`}
          >
            {loading ? 'Authenticating…' : <><LogIn className="h-4 w-4" /> {adminMode ? 'Sign In as Admin' : 'Sign In'}</>}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center space-y-3">
          {adminMode ? <p className="text-xs text-slate-400 pt-2">Student? <Link to="/login" className="font-semibold text-brand-400 hover:underline">Return to student sign in</Link></p> : <><p className="text-xs text-slate-400 pt-2">Don't have an account? <Link to="/register" className="text-brand-400 font-semibold hover:underline">Register here</Link></p><p className="text-xs text-slate-400">Administrator? <Link to="/admin-login" className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:underline"><ShieldCheck className="h-3.5 w-3.5" /> Admin sign in</Link></p></>}
        </div>
      </div>
    </div>
  );
};

export default Login;
