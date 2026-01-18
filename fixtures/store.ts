// Fixture Store - in-memory mutable state for interactive mode without backend

import { Lead, OfflineConversion, Campaign } from '@/types';
import { fixtureLeads } from './leads';
import { fixtureConversions } from './conversions';
import { fixtureCampaigns } from './campaigns';

class FixtureStore {
  private leads: Lead[] = [...fixtureLeads];
  private conversions: OfflineConversion[] = [...fixtureConversions];
  private campaigns: Campaign[] = [...fixtureCampaigns];

  // Leads
  getLeads(): Lead[] {
    return [...this.leads];
  }

  getLeadById(id: string): Lead | undefined {
    return this.leads.find(l => l.id === id);
  }

  updateLead(id: string, updates: Partial<Lead>): Lead {
    const index = this.leads.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    
    this.leads[index] = { ...this.leads[index], ...updates };
    return this.leads[index];
  }

  // Conversions
  getConversions(): OfflineConversion[] {
    return [...this.conversions];
  }

  addConversion(conversion: OfflineConversion): OfflineConversion {
    this.conversions.push(conversion);
    return conversion;
  }

  updateConversion(id: string, updates: Partial<OfflineConversion>): OfflineConversion {
    const index = this.conversions.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Conversion not found');
    
    this.conversions[index] = { ...this.conversions[index], ...updates };
    return this.conversions[index];
  }

  // Campaigns
  getCampaigns(): Campaign[] {
    return [...this.campaigns];
  }

  getCampaignById(id: string): Campaign | undefined {
    return this.campaigns.find(c => c.id === id);
  }
}

export const fixtureStore = new FixtureStore();
