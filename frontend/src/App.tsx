import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CameraView from './pages/CameraView';
import AssistantMode from './pages/AssistantMode';
import CaregiverDashboard from './pages/CaregiverDashboard';
import ComparisonDemo from './pages/ComparisonDemo';
import Login from './pages/Login';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';

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
      <Routes>
        <Route path="/" element={<CameraView />} />
        <Route path="/assistant" element={<AssistantMode />} />
        <Route path="/compare" element={<ComparisonDemo />} />
        <Route path="/dashboard/*" element={<CaregiverDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
