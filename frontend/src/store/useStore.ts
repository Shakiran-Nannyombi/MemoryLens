import { create } from 'zustand';
import { PersonMemory, ObjectMemory, PlaceMemory, SpeechEvent } from '../types';

interface MidnightState {
  useMidnight: boolean;
  walletConnected: boolean;
  walletAddress: string | null;
  pendingTx: boolean;
  lastTxHash: string | null;
}

interface AppState extends MidnightState {
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
  // Midnight actions
  setUseMidnight: (value: boolean) => void;
  setWalletConnected: (connected: boolean, address?: string) => void;
  setPendingTx: (pending: boolean) => void;
  setLastTxHash: (hash: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  // Existing state
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
  // Midnight state
  useMidnight: false,
  walletConnected: false,
  walletAddress: null,
  pendingTx: false,
  lastTxHash: null,
  setUseMidnight: (value) => set({ useMidnight: value }),
  setWalletConnected: (connected, address = null) =>
    set({ walletConnected: connected, walletAddress: address }),
  setPendingTx: (pending) => set({ pendingTx: pending }),
  setLastTxHash: (hash) => set({ lastTxHash: hash }),
}));
