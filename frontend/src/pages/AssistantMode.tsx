import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Phone, Users, MapPin, Box, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

export default function AssistantMode() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { currentLocation, places } = useStore();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const p1 = lat1 * Math.PI / 180;
    const p2 = lat2 * Math.PI / 180;
    const dp = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCurrentLocationName = () => {
    if (!currentLocation || places.length === 0) return 'an unknown location';
    let nearest = places[0];
    let minDist = calculateDistance(currentLocation.lat, currentLocation.lng, nearest.lat, nearest.lng);
    
    for (let i = 1; i < places.length; i++) {
        const dist = calculateDistance(currentLocation.lat, currentLocation.lng, places[i].lat, places[i].lng);
        if (dist < minDist) {
            minDist = dist;
            nearest = places[i];
        }
    }
    
    // Within 200 meters roughly to count as "at" the location
    if (minDist <= nearest.radius_meters) {
       return nearest.name;
    }
    return 'outside near ' + nearest.name;
  };

  const handleHelpWho = () => {
    speak("Point the camera at the person's face. I will try to recognize them for you.");
  };

  const handleHelpWhat = () => {
    speak("Point the camera at the object. I will read out what I see.");
  };

  const handleHelpWhere = () => {
    const loc = getCurrentLocationName();
    const timeStr = format(currentTime, 'h:mm a');
    const msg = `It is ${timeStr}. You are currently at ${loc}. You are safe.`;
    speak(msg);
  };

  const handleCallCaregiver = () => {
    speak("Calling your caregiver now.");
    // In a real app, this would trigger a Twilio call, WebRTC, or a basic tel: link
    window.location.href = "tel:1234567890";
  };

  return (
    <div className="min-h-full bg-[var(--color-natural-bg)] p-6 flex flex-col items-center justify-center pb-24">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl font-bold text-[var(--color-natural-text)]">{format(currentTime, 'h:mm a')}</h1>
        <p className="text-xl text-[#6b7280] font-medium">It is {format(currentTime, 'EEEE, MMMM do')}</p>
        <Button variant="ghost" size="icon" onClick={() => speak(`It is ${format(currentTime, 'h:mm a')} on ${format(currentTime, 'EEEE, MMMM do')}`)}>
            <Volume2 className="w-6 h-6 text-[var(--color-natural-accent)]" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <button 
          onClick={handleHelpWho}
          className="flex flex-col items-center justify-center p-6 bg-[var(--color-natural-card)] rounded-[20px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-transparent hover:-translate-y-1 transition-transform gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center">
            <Users className="w-6 h-6 text-[#166534]" />
          </div>
          <span className="text-[18px] font-bold text-[var(--color-natural-text)]">Who is this?</span>
        </button>

        <button 
          onClick={handleHelpWhat}
          className="flex flex-col items-center justify-center p-6 bg-[var(--color-natural-card)] rounded-[20px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-transparent hover:-translate-y-1 transition-transform gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center">
            <Box className="w-6 h-6 text-[#1e40af]" />
          </div>
          <span className="text-[18px] font-bold text-[var(--color-natural-text)]">What is this?</span>
        </button>

        <button 
          onClick={handleHelpWhere}
          className="flex flex-col items-center justify-center p-6 bg-[var(--color-natural-card)] rounded-[20px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-transparent hover:-translate-y-1 transition-transform gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center">
            <MapPin className="w-6 h-6 text-[#92400e]" />
          </div>
          <span className="text-[18px] font-bold text-[var(--color-natural-text)]">Where am I?</span>
        </button>

        <button 
          onClick={handleCallCaregiver}
          className="flex flex-col items-center justify-center p-6 bg-[#fee2e2] rounded-[20px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] border-2 border-[#ef4444] hover:-translate-y-1 transition-transform gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-[#fca5a5] flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <span className="text-[18px] font-bold text-[#991b1b]">Call Caregiver</span>
        </button>
      </div>
    </div>
  );
}
