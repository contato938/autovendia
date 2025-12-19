import { create } from 'zustand';
import { User } from '@/types';

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  
  // UI State
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  
  isLeadDrawerOpen: boolean;
  setLeadDrawerOpen: (open: boolean) => void;

  openLeadDrawer: (id: string) => void;
  closeLeadDrawer: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null, // Initially null
  setUser: (user) => set({ user }),
  
  selectedLeadId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  
  isLeadDrawerOpen: false,
  setLeadDrawerOpen: (open) => set({ isLeadDrawerOpen: open }),

  openLeadDrawer: (id) => set({ selectedLeadId: id, isLeadDrawerOpen: true }),
  closeLeadDrawer: () => set({ isLeadDrawerOpen: false, selectedLeadId: null }),
}));
