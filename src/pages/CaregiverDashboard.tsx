import React from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabase';
import { Users, Box, MapPin, Activity, LogOut, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-medium">People (Faces)</span>
          </Link>
          <Link to="/dashboard/objects" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
            <Box className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Known Objects</span>
          </Link>
          <Link to="/dashboard/places" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
            <MapPin className="w-5 h-5 text-rose-500" />
            <span className="font-medium">Safe Places</span>
          </Link>
          <Link to="/dashboard/events" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
            <Activity className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Memory Events</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
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
        <h1 className="text-2xl font-bold text-gray-900">Registered People</h1>
        <Button>Add Person</Button>
      </div>
      
      {people.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500 mb-4">No people have been registered yet.</p>
          <Button variant="outline">Add First Person</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map(person => (
            <div key={person.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
               {person.image_url ? (
                 <img src={person.image_url} alt={person.name} className="w-16 h-16 rounded-full object-cover" />
               ) : (
                 <div className="w-16 h-16 rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center text-gray-400">
                   <Users className="w-8 h-8" />
                 </div>
               )}
               <div>
                  <h3 className="font-bold text-lg text-gray-900">{person.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{person.relationship}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{person.note}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
