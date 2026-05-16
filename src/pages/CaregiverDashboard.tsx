import React from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { WalletConnect } from '../components/WalletConnect';
import PrivacyDashboard from './PrivacyDashboard';
import { supabase } from '../lib/supabase';
import { Users, Box, MapPin, Activity, LogOut, ArrowLeft, Shield } from 'lucide-react';

export default function CaregiverDashboard() {
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-surface border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold text-text">Dashboard</h2>
          <p className="text-sm text-muted truncate">{user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background text-text">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium">People (Faces)</span>
          </Link>
          <Link to="/dashboard/objects" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background text-text">
            <Box className="w-5 h-5 text-accent" />
            <span className="font-medium">Known Objects</span>
          </Link>
          <Link to="/dashboard/places" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background text-text">
            <MapPin className="w-5 h-5 text-secondary" />
            <span className="font-medium">Safe Places</span>
          </Link>
          <Link to="/dashboard/events" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background text-text">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-medium">Memory Events</span>
          </Link>
          <Link to="/dashboard/privacy" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background text-text">
            <Shield className="w-5 h-5 text-midnight" />
            <span className="font-medium">Privacy</span>
          </Link>
        </nav>
        {/* Privacy toggle + wallet in sidebar */}
        <div className="p-4 border-t border-border space-y-3">
          <PrivacyToggle />
          <WalletConnect />
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
          </Button>
          <Button variant="ghost" className="w-full justify-start text-secondary hover:opacity-80" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content Content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<PeopleManager />} />
          <Route path="/objects" element={<div className="text-gray-500">Object Manager (WIP)</div>} />
          <Route path="/places" element={<div className="text-gray-500">Places Manager (WIP)</div>} />
          <Route path="/events" element={<div className="text-gray-500">Events Viewer (WIP)</div>} />
          <Route path="/privacy" element={<PrivacyDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

function PeopleManager() {
  const people = useStore(state => state.people);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Registered People</h1>
        <Button>Add Person</Button>
      </div>

      {people.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted mb-4">No people have been registered yet.</p>
          <Button variant="outline">Add First Person</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map(person => (
            <div key={person.id} className="bg-surface p-4 rounded-xl shadow-sm border border-border flex items-center space-x-4">
              {person.image_url ? (
                <img src={person.image_url} alt={person.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-border flex flex-shrink-0 items-center justify-center text-muted">
                  <Users className="w-8 h-8" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg text-text">{person.name}</h3>
                <p className="text-sm text-primary font-medium">{person.relationship}</p>
                <p className="text-sm text-muted mt-1 line-clamp-2">{person.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
