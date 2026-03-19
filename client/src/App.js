import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import ChatSupport from './pages/ChatSupport';
import Meditation from './pages/Meditation';
import Music from './pages/Music';
import Games from './pages/Games';
import Profile from './pages/Profile';

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout><Dashboard /></Layout>
            </PrivateRoute>
          } />
          <Route path="/mood" element={
            <PrivateRoute>
              <Layout><MoodTracker /></Layout>
            </PrivateRoute>
          } />
          <Route path="/chat" element={
            <PrivateRoute>
              <Layout><ChatSupport /></Layout>
            </PrivateRoute>
          } />
          <Route path="/meditate" element={
            <PrivateRoute>
              <Layout><Meditation /></Layout>
            </PrivateRoute>
          } />
          <Route path="/music" element={
            <PrivateRoute>
              <Layout><Music /></Layout>
            </PrivateRoute>
          } />
          <Route path="/games" element={
            <PrivateRoute>
              <Layout><Games /></Layout>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Layout><Profile /></Layout>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
