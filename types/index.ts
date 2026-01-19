// Domain Types for AutovendaIA

export type Role = 'admin' | 'gestor' | 'vendedor';

export type AdsPlatform = 'google';

export type LeadStage = 'Novo' | 'Em conversa (WhatsApp)' | 'Qualificado' | 'Vendido' | 'Perdido';

export type CampaignStatus = 'active' | 'paused' | 'ended';

export type ConversionStatus = 'queued' | 'sent' | 'failed';

// User & Tenant
export interface Tenant {
  id: string;
  nome: string;
  cnpj: string | null;
  logoUrl?: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  tenantId: string;
}

// Metrics & KPIs
export interface MetricKpi {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  leads: number;
  cpl: number;
  purchases: number;
  revenue: number;
  roas: number;
}

export interface TimeSeriesPoint {
  date: string; // ISO format
  spend: number;
  leads: number;
  purchases: number;
  revenue: number;
}

export interface DashboardFunnel {
  clicks: number;
  whatsappMessages: number;
  sales: number;
}

// Campaign
export interface Campaign {
  id: string;
  platform: AdsPlatform;
  name: string;
  status: CampaignStatus;
  spend: number;
  leads: number;
  purchases: number;
  revenue: number;
  roas: number;
  updatedAt: string; // ISO
}

// Lead
export interface Lead {
  id: string;
  name: string;
  phone: string;
  createdAt: string; // ISO
  stage: LeadStage;
  platform: AdsPlatform;
  campaignId: string;
  campaignName: string;
  adsetName?: string;
  creativeName?: string;
  gclid?: string;
  fbclid?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmContent?: string;
  firstMessageAt?: string; // ISO
  lastMessageAt?: string; // ISO
  sale?: {
    value: number;
    currency: string;
    happenedAt: string; // ISO
    status: 'won' | 'lost';
  };
  tenantId: string;
}

export interface LeadInteraction {
  id: string;
  leadId: string;
  type: 'whatsapp' | 'call';
  direction: 'in' | 'out';
  content: string;
  createdAt: string; // ISO
  userId?: string;
}

// Offline Conversion
export interface OfflineConversion {
  id: string;
  leadId: string;
  platform: AdsPlatform;
  eventName: string; // ex: 'purchase', 'lead'
  value: number;
  currency: string;
  happenedAt: string; // ISO - quando aconteceu a conversão
  sentAt?: string; // ISO - quando foi enviada para a plataforma
  status: ConversionStatus;
  errorMessage?: string;
}

// Integration Status
export interface IntegrationStatus {
  platform: 'google_ads' | 'meta_ads' | 'whatsapp';
  connected: boolean;
  lastSyncAt?: string; // ISO
  error?: string;
}
