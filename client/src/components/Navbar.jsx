import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/mood', label: 'Mood', icon: '💫' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/meditate', label: 'Meditate', icon: '🧘' },
    { path: '/music', label: 'Music', icon: '🎵' },
    { path: '/games', label: 'Games', icon: '🎮' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-sage-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-400 to-lavender-400 flex items-center justify-center text-white text-sm font-bold">M</div>
          <span className="font-display text-xl text-sage-700 font-semibold">MindWell</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-3 py-1.5 rounded-lg text-sm font-sans transition-all duration-200
                ${location.pathname === link.path
                  ? 'bg-sage-100 text-sage-700 font-medium'
                  : 'text-gray-500 hover:bg-sage-50 hover:text-sage-600'}`}>
              <span className="mr-1">{link.icon}</span>{link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-gray-500 font-sans">Hi, {user?.name?.split(' ')[0]}</span>
          <button onClick={handleLogout}
            className="px-4 py-1.5 rounded-lg text-sm font-sans text-red-500 hover:bg-red-50 transition-colors">
            Logout
          </button>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1">
            <span className={`block w-5 h-0.5 bg-sage-600 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-sage-600 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-sage-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-sage-100 px-4 py-3">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans transition-all my-0.5
                ${location.pathname === link.path ? 'bg-sage-100 text-sage-700' : 'text-gray-600 hover:bg-sage-50'}`}>
              <span>{link.icon}</span>{link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-500 text-sm hover:bg-red-50 rounded-lg mt-1">
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
