import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-400', width: '20%' };
    if (score <= 2) return { label: 'Fair', color: 'bg-orange-400', width: '40%' };
    if (score <= 3) return { label: 'Good', color: 'bg-yellow-400', width: '60%' };
    if (score <= 4) return { label: 'Strong', color: 'bg-sage-400', width: '80%' };
    return { label: 'Very Strong', color: 'bg-sage-500', width: '100%' };
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Please enter a valid email';
    if (!form.password || form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    setApiError('');
    try {
      const res = await authAPI.signup({ name: form.name.trim(), email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password ? getPasswordStrength(form.password) : null;

  return (
    <div className="min-h-screen flex page-bg">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sage-500 via-sage-600 to-lavender-600 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bubble" style={{
              width: `${40 + i * 20}px`, height: `${40 + i * 20}px`,
              left: `${10 + i * 15}%`, animationDuration: `${8 + i * 2}s`,
              animationDelay: `${i * 1.5}s`
            }} />
          ))}
        </div>
        <div className="relative text-center text-white">
          <div className="text-6xl mb-6 animate-float">🌿</div>
          <h1 className="font-display text-4xl font-light mb-4">Begin Your Wellness Journey</h1>
          <p className="text-sage-100 text-lg leading-relaxed max-w-md font-sans font-light">
            A safe space to nurture your mental well-being, track your emotions, and find peace in everyday moments.
          </p>
          <div className="mt-8 flex gap-6 justify-center text-sage-100">
            <div className="text-center">
              <div className="text-2xl font-display font-semibold">100%</div>
              <div className="text-xs font-sans">Private</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-semibold">24/7</div>
              <div className="text-xs font-sans">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-semibold">Free</div>
              <div className="text-xs font-sans">Always</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-sage-400 to-lavender-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-display font-bold">M</span>
              </div>
              <h2 className="font-display text-3xl text-gray-800 mb-1">Create Account</h2>
              <p className="text-gray-500 font-sans text-sm">Your wellness journey starts here</p>
            </div>

            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-sans text-center">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Full Name</label>
                <input className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
                  type="text" placeholder="Your name" value={form.name}
                  onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: ''}); }} />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-sans">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Email Address</label>
                <input className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => { setForm({...form, email: e.target.value}); setErrors({...errors, email: ''}); }} />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Password</label>
                <input className={`input-field ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  type="password" placeholder="At least 8 characters" value={form.password}
                  onChange={e => { setForm({...form, password: e.target.value}); setErrors({...errors, password: ''}); }} />
                {form.password && strength && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-500`} style={{ width: strength.width }}></div>
                    </div>
                    <p className="text-xs mt-1 font-sans text-gray-500">{strength.label} password</p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1 font-sans">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Confirm Password</label>
                <input className={`input-field ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                  type="password" placeholder="Confirm your password" value={form.confirmPassword}
                  onChange={e => { setForm({...form, confirmPassword: e.target.value}); setErrors({...errors, confirmPassword: ''}); }} />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-sans">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating account...</>
                ) : 'Begin My Journey →'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 font-sans mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-sage-600 hover:text-sage-700 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
