'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, DollarSign, MousePointerClick, MessageSquare, ShoppingCart } from 'lucide-react';
import type { CampaignRow } from '@/types/googleAdsDashboard';

interface CampaignDetailsDrawerProps {
  campaign: CampaignRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDetailsDrawer({ campaign, isOpen, onClose }: CampaignDetailsDrawerProps) {
  if (!campaign) return null;

  const conversionRate = campaign.clicks > 0 ? (campaign.whatsapp_started / campaign.clicks) * 100 : 0;
  const saleRate = campaign.whatsapp_started > 0 ? (campaign.purchases / campaign.whatsapp_started) * 100 : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{campaign.name}</SheetTitle>
          <div className="flex items-center gap-2 pt-2">
            <Badge 
              variant={
                campaign.status === 'active' ? 'default' : 
                campaign.status === 'paused' ? 'secondary' : 
                'outline'
              }
            >
              {campaign.status === 'active' ? 'Ativa' : 
               campaign.status === 'paused' ? 'Pausada' : 
               'Encerrada'}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Resumo de Performance */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">Investimento</div>
                  </div>
                  <div className="text-xl font-bold">
                    R$ {campaign.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">Cliques</div>
                  </div>
                  <div className="text-xl font-bold">{campaign.clicks.toLocaleString('pt-BR')}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    CPC: R$ {campaign.cpc.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">WhatsApp</div>
                  </div>
                  <div className="text-xl font-bold">{campaign.whatsapp_started}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {conversionRate.toFixed(1)}% dos cliques
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">Vendas</div>
                  </div>
                  <div className="text-xl font-bold">{campaign.purchases}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {saleRate.toFixed(1)}% das conversas
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 bg-primary/5">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div className="text-sm text-muted-foreground">ROAS</div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {campaign.roas > 0 ? `${campaign.roas.toFixed(2)}x` : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Receita: R$ {campaign.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Conversas e Leads Atribuídos (placeholder) */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Últimas Conversas Atribuídas</h3>
            <div className="text-sm text-muted-foreground text-center py-8 bg-muted/30 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Detalhes de conversas em breve
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
