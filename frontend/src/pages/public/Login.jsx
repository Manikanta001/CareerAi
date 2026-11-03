import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';
import ErrorMessage from '../../components/ErrorMessage';

const Login = () => {
  const [email, setEmail] = useState('user@careerai.com');
  const [password, setPassword] = useState('User@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'ADMIN') {
      setEmail('admin@careerai.com');
      setPassword('Admin@123');
    } else {
      setEmail('user@careerai.com');
      setPassword('User@123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to access your CareerAI placement portal</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
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
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
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
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : <><LogIn className="h-4 w-4" /> Sign In</>}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center space-y-3">
          <div className="text-xs text-slate-400">Quick Fill Demo Credentials:</div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => fillDemo('USER')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
            >
              Demo Student
            </button>
            <button
              onClick={() => fillDemo('ADMIN')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs font-semibold text-amber-300 border border-amber-500/30"
            >
              Demo Admin
            </button>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
