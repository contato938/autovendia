import { Lead, Quote, User, Interaction, Tenant } from '@/types';
import { mockLeads, mockUsers, mockTenant, mockInteractions, mockQuotes } from '@/mocks/data';

// In-memory "database"
let leads = [...mockLeads];
let interactions = [...mockInteractions];
let quotes = [...mockQuotes];
let currentUser: User | null = null; // simulate session

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(600);
      if (email === 'error@test.com') throw new Error('Credenciais inválidas');
      // Mock login - allow any email from mockUsers or just pick the first one matching
      const user = mockUsers.find(u => u.email === email) || mockUsers[0];
      currentUser = user;
      return user;
    },
    logout: async () => {
      await delay(300);
      currentUser = null;
    },
    me: async () => {
      await delay(300);
      return currentUser;
    }
  },
  
  leads: {
    list: async (): Promise<Lead[]> => {
      await delay(500);
      return [...leads];
    },
    getById: async (id: string): Promise<Lead | undefined> => {
      await delay(400);
      return leads.find(l => l.id === id);
    },
    update: async (id: string, updates: Partial<Lead>): Promise<Lead> => {
      await delay(500);
      const index = leads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead not found');
      
      leads[index] = { ...leads[index], ...updates };
      return leads[index];
    },
    addInteraction: async (interaction: Omit<Interaction, 'id' | 'createdAt'>): Promise<Interaction> => {
      await delay(400);
      const newInteraction: Interaction = {
        ...interaction,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date()
      };
      interactions.push(newInteraction);
      return newInteraction;
    },
    getInteractions: async (leadId: string): Promise<Interaction[]> => {
      await delay(400);
      return interactions.filter(i => i.leadId === leadId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
  },
  
  dashboard: {
    getStats: async () => {
      await delay(600);
      return {
        leadsGenerated: leads.length,
        quotesSent: quotes.filter(q => q.status === 'enviado').length,
        sales: 12,
        conversionRate: 15.4,
        cac: 45.90,
        roi: 320
      };
    }
  }
};
