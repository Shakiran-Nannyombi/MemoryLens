import { create } from 'zustand';
import type { ReactNode } from 'react';
import { PersonMemory, ObjectMemory, PlaceMemory, SpeechEvent } from '../types';
import { connectWallet, disconnectWallet, initWalletListeners } from '../midnight/lib/wallet';
import { getContractStats } from '../midnight/lib/contract';
import type { ContractStats } from '../midnight/types';

export interface ToastData {
  icon: string;
  message: ReactNode;
  id: string;
}

interface MidnightState {
  useMidnight: boolean;
  walletConnected: boolean;
  walletAddress: string | null;
  walletError: string | null;
  pendingTx: boolean;
  lastTxHash: string | null;
  contractStats: ContractStats | null;
  pendingTransactions: string[];
  isConnectingWallet: boolean;
  isStoringMemory: boolean;
  proofGenerationProgress: string | null;
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
  toggleStorage: () => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  setWalletConnected: (connected: boolean, address?: string) => void;
  setWalletError: (error: string | null) => void;
  setPendingTx: (pending: boolean) => void;
  setLastTxHash: (hash: string | null) => void;
  addPendingTransaction: (txHash: string) => void;
  removePendingTransaction: (txHash: string) => void;
  updateContractStats: () => Promise<void>;
  setProofGenerationProgress: (progress: string | null) => void;
  // Redesign state
  activeToast: ToastData | null;
  recognizedPerson: PersonMemory | null;
  activeNavSection: string;
  setActiveToast: (toast: ToastData | null) => void;
  setRecognizedPerson: (person: PersonMemory | null) => void;
  setActiveNavSection: (section: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
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
  walletError: null,
  pendingTx: false,
  lastTxHash: null,
  contractStats: null,
  pendingTransactions: [],
  isConnectingWallet: false,
  isStoringMemory: false,
  proofGenerationProgress: null,

  // Midnight actions
  setUseMidnight: (value) => set({ useMidnight: value }),

  toggleStorage: () => set((state) => ({ useMidnight: !state.useMidnight })),

  connectWallet: async () => {
    set({ isConnectingWallet: true, walletError: null });
    try {
      const address = await connectWallet();
      set({
        walletConnected: true,
        walletAddress: address,
        isConnectingWallet: false,
        walletError: null,
      });

      // Initialize wallet listeners
      initWalletListeners();

      // Update contract stats
      await get().updateContractStats();
    } catch (error: any) {
      set({
        walletConnected: false,
        walletAddress: null,
        isConnectingWallet: false,
        walletError: error.message || 'Failed to connect wallet',
      });
      throw error;
    }
  },

  disconnectWallet: async () => {
    try {
      await disconnectWallet();
      set({
        walletConnected: false,
        walletAddress: null,
        walletError: null,
        contractStats: null,
      });
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error);
    }
  },

  setWalletConnected: (connected, address = null) =>
    set({ walletConnected: connected, walletAddress: address }),

  setWalletError: (error) => set({ walletError: error }),

  setPendingTx: (pending) => set({ pendingTx: pending }),

  setLastTxHash: (hash) => set({ lastTxHash: hash }),

  addPendingTransaction: (txHash) =>
    set((state) => ({
      pendingTransactions: [...state.pendingTransactions, txHash]
    })),

  removePendingTransaction: (txHash) =>
    set((state) => ({
      pendingTransactions: state.pendingTransactions.filter(tx => tx !== txHash)
    })),

  updateContractStats: async () => {
    try {
      const stats = await getContractStats();
      set({ contractStats: stats });
    } catch (error) {
      console.error('Failed to update contract stats:', error);
    }
  },

  setProofGenerationProgress: (progress) =>
    set({ proofGenerationProgress: progress }),

  // Redesign state
  activeToast: null,
  recognizedPerson: null,
  activeNavSection: 'people',
  setActiveToast: (toast) => set({ activeToast: toast }),
  setRecognizedPerson: (person) => set({ recognizedPerson: person }),
  setActiveNavSection: (section) => set({ activeNavSection: section }),
}));
