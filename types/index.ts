export type Role = "admin" | "gestor" | "vendedor";

export type LeadChannel = "WhatsApp" | "Telefone";
export type LeadSource = "Google Ads" | "Indicação" | "Orgânico";
export type LeadStage =
  | "Novo"
  | "Em atendimento"
  | "Orçamento gerado"
  | "Orçamento enviado"
  | "Negociação"
  | "Fechado"
  | "Perdido";

export interface Tenant {
  id: string;
  nome: string;
  cnpj: string;
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

export interface Vehicle {
  marca: string;
  modelo: string;
  ano: number;
  motor?: string;
}

export interface Part {
  nome: string;
  sku: string;
  compatibilidadeResumo: string;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  origem: LeadSource;
  campanha?: string;
  canal: LeadChannel;
  etapa: LeadStage;
  responsavelId?: string;
  score: number; // 0-100
  lastContactAt?: Date; // or string ISO
  nextActionAt?: Date;
  nextActionNote?: string;
  vehicle?: Vehicle;
  part?: Part;
  tenantId: string;
  createdAt: Date;
}

export interface Interaction {
  id: string;
  leadId: string;
  type: "whatsapp" | "call";
  direction: "in" | "out";
  content: string; // text or transcription or summary
  createdAt: Date;
  user?: User; // who performed it
}

export interface QuoteItem {
  id: string;
  produto: string;
  sku: string;
  quantidade: number;
  precoUnitario: number;
  total: number;
}

export interface Quote {
  id: string;
  leadId: string;
  status: "rascunho" | "enviado" | "aprovado";
  items: QuoteItem[];
  total: number;
  createdAt: Date;
  validUntil?: Date;
}

// KPI Dashboard Types
export interface DashboardStats {
  leadsGenerated: number;
  quotesSent: number;
  sales: number;
  conversionRate: number;
  cac: number;
  roi: number;
}

export interface DashboardFunnelData {
  stage: string;
  value: number;
}

export interface DashboardRoiData {
  date: string;
  value: number;
}
