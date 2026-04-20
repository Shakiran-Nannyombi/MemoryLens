import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import CameraView from './pages/CameraView';
import AssistantMode from './pages/AssistantMode';
import CaregiverDashboard from './pages/CaregiverDashboard';
import Login from './pages/Login';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import { Camera, HelpCircle, Settings } from 'lucide-react';

function BottomNav() {
  const location = useLocation();
  if (location.pathname === '/login' || location.pathname.startsWith('/dashboard')) return null;

  return (
    <nav className="fixed bottom-0 w-full bg-[var(--color-natural-card)] border-t border-gray-200 flex justify-around items-center py-3 z-50 pb-safe">
      <Link to="/" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/' ? 'text-[var(--color-natural-accent)] bg-[var(--color-natural-bg)]' : 'text-gray-500'}`}>
        <Camera className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Lens</span>
      </Link>
      <Link to="/assistant" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/assistant' ? 'text-[var(--color-natural-accent)] bg-[var(--color-natural-bg)]' : 'text-gray-500'}`}>
        <HelpCircle className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Help</span>
      </Link>
      <Link to="/login" className="flex flex-col items-center p-2 rounded-lg text-gray-500 hover:bg-[var(--color-natural-bg)] hover:text-[var(--color-natural-accent)]">
        <Settings className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Caregiver</span>
      </Link>
    </nav>
  );
}

export default function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-[100dvh] bg-[var(--color-natural-bg)] text-[var(--color-natural-text)] font-sans">
        <main className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route path="/" element={<CameraView />} />
            <Route path="/assistant" element={<AssistantMode />} />
            <Route path="/dashboard/*" element={<CaregiverDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
