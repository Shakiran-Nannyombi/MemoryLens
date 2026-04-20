import { create } from 'zustand';
import { PersonMemory, ObjectMemory, PlaceMemory, SpeechEvent } from '../types';

interface AppState {
  people: PersonMemory[];
  objects: ObjectMemory[];
  places: PlaceMemory[];
  events: SpeechEvent[];
  user: any;
  currentLocation: { lat: number; lng: number } | null;
  setLocation: (lat: number, lng: number) => void;
  setPeople: (people: PersonMemory[]) => void;
  setObjects: (objects: ObjectMemory[]) => void;
  setPlaces: (places: PlaceMemory[]) => void;
  setEvents: (events: SpeechEvent[]) => void;
  addEvent: (event: SpeechEvent) => void;
  setUser: (user: any) => void;
}

export const useStore = create<AppState>((set) => ({
  people: [],
  objects: [],
  places: [],
  events: [],
  user: null,
  currentLocation: null,
  setLocation: (lat, lng) => set({ currentLocation: { lat, lng } }),
  setPeople: (people) => set({ people }),
  setObjects: (objects) => set({ objects }),
  setPlaces: (places) => set({ places }),
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  setUser: (user) => set({ user }),
}));
