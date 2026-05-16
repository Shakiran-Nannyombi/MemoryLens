import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import CameraView from './pages/CameraView';
import AssistantMode from './pages/AssistantMode';
import CaregiverDashboard from './pages/CaregiverDashboard';
import ComparisonDemo from './pages/ComparisonDemo';
import Login from './pages/Login';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';
import { Camera, HelpCircle, Settings, BarChart2 } from 'lucide-react';

function BottomNav() {
  const location = useLocation();
  if (location.pathname === '/login' || location.pathname.startsWith('/dashboard')) return null;

  return (
    <nav className="fixed bottom-0 w-full bg-surface border-t border-border flex justify-around items-center py-3 z-50 pb-safe">
      <Link to="/" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/' ? 'text-primary bg-background' : 'text-muted'}`}>
        <Camera className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Lens</span>
      </Link>
      <Link to="/assistant" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/assistant' ? 'text-primary bg-background' : 'text-muted'}`}>
        <HelpCircle className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Help</span>
      </Link>
      <Link to="/compare" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/compare' ? 'text-midnight bg-midnight-light' : 'text-muted'}`}>
        <BarChart2 className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Compare</span>
      </Link>
      <Link to="/login" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/login' ? 'text-primary bg-background' : 'text-muted'}`}>
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
      <div className="flex flex-col h-[100dvh] bg-background text-text font-sans">
        <main className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route path="/" element={<CameraView />} />
            <Route path="/assistant" element={<AssistantMode />} />
            <Route path="/compare" element={<ComparisonDemo />} />
            <Route path="/dashboard/*" element={<CaregiverDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
