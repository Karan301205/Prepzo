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

// Protects routes — redirects to Clerk sign-in if not authenticated
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

  // Sync Clerk user to Supabase on every sign-in
  useEffect(() => {
    if (isSignedIn && user) {
      upsertUser(user);
    }
  }, [isSignedIn, user]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />

        {/* Protected — must be signed in */}
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
  // Show splash only once per browser session
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('prepzo_splashed');
  });

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem('prepzo_splashed', '1');
    }
  }, [showSplash]);

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
