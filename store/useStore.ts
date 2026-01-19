import { create } from 'zustand';
import { User, Tenant } from '@/types';

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Tenant management
  tenants: Tenant[];
  setTenants: (tenants: Tenant[]) => void;
  selectedTenantId: string | null;
  setSelectedTenantId: (tenantId: string) => void;
  
  // UI State
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  
  isLeadDrawerOpen: boolean;
  setLeadDrawerOpen: (open: boolean) => void;

  openLeadDrawer: (id: string) => void;
  closeLeadDrawer: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null, // Initially null
  setUser: (user) => set({ user }),
  
  tenants: [],
  setTenants: (tenants) => set({ tenants }),
  selectedTenantId: null,
  setSelectedTenantId: (tenantId) => set({ selectedTenantId: tenantId }),
  
  selectedLeadId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  
  isLeadDrawerOpen: false,
  setLeadDrawerOpen: (open) => set({ isLeadDrawerOpen: open }),

  openLeadDrawer: (id) => set({ selectedLeadId: id, isLeadDrawerOpen: true }),
  closeLeadDrawer: () => set({ isLeadDrawerOpen: false, selectedLeadId: null }),
}));
