import { Metadata } from 'next';
import { LandingPage } from '@/components/marketing/LandingPage';

export const metadata: Metadata = {
  title: 'AUTOVEND IA',
  description: 'Atribuição completa do clique à venda no WhatsApp, com conversões offline no Google Ads.',
};

export default function Home() {
  return <LandingPage />;
}
