import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await profileAPI.get();
      setProfile(res.data.data);
      setName(res.data.data.name);
    } catch {}
  };

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const handleUpdate = async () => {
    if (!name.trim() || name.trim().length < 2) { showMessage('Name must be at least 2 characters', 'error'); return; }
    setLoading(true);
    try {
      const res = await profileAPI.update({ name: name.trim() });
      setProfile(res.data.data);
      updateUser({ ...user, name: res.data.data.name });
      setEditing(false);
      showMessage('Profile updated successfully!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Update failed', 'error');
    } finally { setLoading(false); }
  };

  const handlePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { showMessage('Please fill all password fields', 'error'); return; }
    if (pwForm.newPassword !== pwForm.confirm) { showMessage('New passwords do not match', 'error'); return; }
    if (pwForm.newPassword.length < 8) { showMessage('New password must be at least 8 characters', 'error'); return; }
    setLoading(true);
    try {
      await profileAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      showMessage('Password changed successfully!');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Password change failed', 'error');
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await profileAPI.delete();
      logout();
      navigate('/login');
    } catch {} finally { setLoading(false); }
  };

  if (!profile) return (
    <div className="page-bg min-h-screen pt-20 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sage-300 border-t-sage-500 rounded-full animate-spin"></div>
    </div>
  );

  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-bg min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-800 mb-2">Profile & Settings</h1>
          <p className="text-gray-500 font-sans">Manage your account and preferences</p>
        </div>

        {msg.text && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-sans text-center ${msg.type === 'error' ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-sage-50 border border-sage-200 text-sage-700'}`}>
            {msg.text}
          </div>
        )}

        {/* Avatar card */}
        <div className="glass rounded-2xl p-6 mb-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-400 to-lavender-400 flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <h2 className="font-display text-2xl text-gray-800">{profile.name}</h2>
            <p className="text-gray-500 font-sans text-sm">{profile.email}</p>
            <p className="text-gray-400 font-sans text-xs mt-0.5">Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[['profile', '👤 Profile'], ['security', '🔐 Security'], ['privacy', '🛡️ Privacy']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl text-sm font-sans font-medium transition-all
                ${activeTab === key ? 'bg-sage-500 text-white' : 'bg-white border border-sage-200 text-gray-600 hover:bg-sage-50'}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="glass rounded-2xl p-6 animate-slideUp">
            <h3 className="font-display text-xl text-gray-700 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Full Name</label>
                {editing ? (
                  <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
                ) : (
                  <p className="px-4 py-3 bg-sage-50 rounded-xl text-gray-700 font-sans">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-sans font-medium text-gray-700 mb-1">Email</label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-500 font-sans text-sm">{profile.email} <span className="text-xs">(cannot be changed)</span></p>
              </div>
              <div className="flex gap-3">
                {editing ? (
                  <>
                    <button onClick={handleUpdate} disabled={loading} className="btn-primary text-sm px-5 py-2">
                      {loading ? 'Saving...' : '✓ Save Changes'}
                    </button>
                    <button onClick={() => { setEditing(false); setName(profile.name); }} className="btn-secondary text-sm px-5 py-2">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="btn-secondary text-sm px-5 py-2">✏️ Edit Profile</button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="glass rounded-2xl p-6 animate-slideUp">
            <h3 className="font-display text-xl text-gray-700 mb-4">Change Password</h3>
            <div className="space-y-4">
              {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirm', 'Confirm New Password']].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-sans font-medium text-gray-700 mb-1">{label}</label>
                  <input type="password" className="input-field"
                    value={pwForm[key]} onChange={e => setPwForm({...pwForm, [key]: e.target.value})}
                    placeholder={label} />
                </div>
              ))}
              <button onClick={handlePassword} disabled={loading} className="btn-primary text-sm px-5 py-2">
                {loading ? 'Updating...' : '🔐 Update Password'}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-red-100">
              <h3 className="font-display text-xl text-red-600 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-500 font-sans mb-4">Deleting your account is permanent and cannot be undone.</p>
              {!showDelete ? (
                <button onClick={() => setShowDelete(true)} className="px-5 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-sans hover:bg-red-100 transition-colors">
                  Delete Account
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-700 font-sans mb-3">Are you absolutely sure? All your data will be permanently deleted.</p>
                  <div className="flex gap-3">
                    <button onClick={handleDelete} disabled={loading}
                      className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-sans hover:bg-red-600 transition-colors">
                      {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                    <button onClick={() => setShowDelete(false)} className="btn-secondary text-sm px-5 py-2">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="glass rounded-2xl p-6 animate-slideUp">
            <h3 className="font-display text-xl text-gray-700 mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-sage-50 rounded-xl">
                <div>
                  <h4 className="font-sans font-medium text-gray-700 text-sm">Anonymous Mode</h4>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">Use MindWell without displaying your real name</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={profile.privacySettings?.anonymousMode || false}
                    onChange={async (e) => {
                      await profileAPI.update({ privacySettings: { ...profile.privacySettings, anonymousMode: e.target.checked } });
                      setProfile(p => ({ ...p, privacySettings: { ...p.privacySettings, anonymousMode: e.target.checked } }));
                    }} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500"></div>
                </label>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-700 font-sans leading-relaxed">
                  🔒 <strong>Your Privacy Matters:</strong> All mood logs and chat conversations are encrypted and stored securely. We never share your mental health data with third parties. You can delete all your data at any time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
