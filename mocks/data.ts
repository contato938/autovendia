import { Lead, Quote, User, Tenant, Interaction, LeadStage } from '@/types';
import { addDays, subDays, subHours } from 'date-fns';

export const mockTenant: Tenant = {
  id: 't1',
  nome: 'AutoPeças Silva',
  cnpj: '12.345.678/0001-90',
  logoUrl: 'https://github.com/shadcn.png' // placeholder
};

export const mockUsers: User[] = [
  { id: 'u1', nome: 'Carlos Gerente', email: 'carlos@autovend.ia', role: 'admin', tenantId: 't1', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  { id: 'u2', nome: 'Ana Vendas', email: 'ana@autovend.ia', role: 'vendedor', tenantId: 't1', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
  { id: 'u3', nome: 'Pedro Junior', email: 'pedro@autovend.ia', role: 'vendedor', tenantId: 't1', avatarUrl: 'https://i.pravatar.cc/150?u=3' },
];

const brands = ['Fiat', 'Volkswagen', 'Chevrolet', 'Ford', 'Toyota'];
const models = ['Uno', 'Gol', 'Onix', 'Ka', 'Corolla'];
const parts = ['Amortecedor Dianteiro', 'Pastilha de Freio', 'Kit Embreagem', 'Farol Direito', 'Bomba D\'água'];
const stages: LeadStage[] = ['Novo', 'Em atendimento', 'Orçamento gerado', 'Orçamento enviado', 'Negociação', 'Fechado', 'Perdido'];

const generateLeads = (count: number): Lead[] => {
  return Array.from({ length: count }).map((_, i) => {
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const hasNextAction = Math.random() > 0.5;
    const responsible = Math.random() > 0.3 ? mockUsers[Math.floor(Math.random() * mockUsers.length)] : undefined;
    
    return {
      id: `l${i + 1}`,
      nome: `Cliente ${i + 1}`,
      telefone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
      origem: Math.random() > 0.6 ? 'Google Ads' : (Math.random() > 0.3 ? 'Indicação' : 'Orgânico'),
      campanha: Math.random() > 0.7 ? 'Promoção Freio' : undefined,
      canal: Math.random() > 0.5 ? 'WhatsApp' : 'Telefone',
      etapa: stage,
      responsavelId: responsible?.id,
      score: Math.floor(Math.random() * 100),
      lastContactAt: subHours(new Date(), Math.floor(Math.random() * 48)),
      nextActionAt: hasNextAction ? addDays(new Date(), Math.floor(Math.random() * 5)) : undefined,
      nextActionNote: hasNextAction ? 'Ligar para verificar interesse' : undefined,
      vehicle: {
        marca: brands[Math.floor(Math.random() * brands.length)],
        modelo: models[Math.floor(Math.random() * models.length)],
        ano: 2010 + Math.floor(Math.random() * 14)
      },
      part: {
        nome: parts[Math.floor(Math.random() * parts.length)],
        sku: `SKU-${1000 + i}`,
        compatibilidadeResumo: 'Compatível com modelos 2010+'
      },
      tenantId: 't1',
      createdAt: subDays(new Date(), Math.floor(Math.random() * 30))
    };
  });
};

export const mockLeads = generateLeads(35);

export const mockInteractions: Interaction[] = [
  {
    id: 'i1', leadId: 'l1', type: 'whatsapp', direction: 'in',
    content: 'Olá, gostaria de saber o preço do amortecedor do Gol G5.',
    createdAt: subHours(new Date(), 24),
    user: mockUsers[1]
  },
  {
    id: 'i2', leadId: 'l1', type: 'whatsapp', direction: 'out',
    content: 'Olá! Temos sim, a marca Monroe está saindo por R$ 450,00 o par. Tem interesse?',
    createdAt: subHours(new Date(), 23),
    user: mockUsers[1]
  }
];

export const mockQuotes: Quote[] = [];
