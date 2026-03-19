import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex page-bg">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-lavender-600 via-lavender-500 to-sage-500 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bubble" style={{
              width: `${50 + i * 25}px`, height: `${50 + i * 25}px`,
              left: `${15 + i * 17}%`, animationDuration: `${10 + i * 2}s`,
              animationDelay: `${i * 2}s`
            }} />
          ))}
        </div>
        <div className="relative text-center text-white">
          <div className="text-6xl mb-6 animate-float">☮️</div>
          <h1 className="font-display text-4xl font-light mb-4">Welcome Back</h1>
          <p className="text-lavender-100 text-lg leading-relaxed max-w-md font-sans font-light">
            Your mental wellness journey continues. We're glad you're taking care of yourself.
          </p>
          <div className="mt-10 space-y-3">
            {['Mood Tracking & Insights', 'AI-Powered Support', 'Guided Meditation & Breathing', 'Therapeutic Music & Games'].map(f => (
              <div key={f} className="flex items-center gap-3 text-lavender-100 font-sans text-sm">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-lavender-400 to-sage-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-display font-bold">M</span>
              </div>
              <h2 className="font-display text-3xl text-gray-800 mb-1">Sign In</h2>
              <p className="text-gray-500 font-sans text-sm">Continue your wellness journey</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-sans text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Email Address</label>
                <input className="input-field" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Password</label>
                <input className="input-field" type="password" placeholder="Your password"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Signing in...</>
                ) : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 font-sans mt-6">
              New to MindWell?{' '}
              <Link to="/signup" className="text-lavender-600 hover:text-lavender-700 font-medium">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
