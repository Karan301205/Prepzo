import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth, useUser, RedirectToSignIn } from '@clerk/react';
import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';

import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import ResultPage from './pages/ResultPage';
import ChatPage from './pages/ChatPage';
import AnalyticsPage from './pages/AnalyticsPage';
import InsightsPage from './pages/InsightsPage';
import { upsertUser } from './services/supabase';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#F5F5F5', fontFamily: "'Sora', sans-serif", color: '#6B6B80', fontSize: 15,
    }}>
      Loading...
    </div>
  );
  if (!isSignedIn) return <RedirectToSignIn />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      upsertUser(user);
    }
  }, [isSignedIn, user]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/input"     element={<ProtectedRoute><InputPage /></ProtectedRoute>} />
        <Route path="/result"    element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        <Route path="/chat"      element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/insights"  element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  // FIX: Show splash on EVERY page load/reload (not just once per session)
  // We use a random key so it always renders fresh on mount
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <AnimatedRoutes />
    </BrowserRouter>
  );
}