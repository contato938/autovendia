import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import type { CampaignRow } from '@/types/googleAdsDashboard';
import { Separator } from '@/components/ui/separator';

interface CampaignDetailsDrawerProps {
  campaign: CampaignRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDetailsDrawer({ campaign, isOpen, onClose }: CampaignDetailsDrawerProps) {
  if (!campaign) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{campaign.name}</SheetTitle>
          <SheetDescription>
            Detalhes de performance e leads atribuídos
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">Investimento</span>
              <p className="text-2xl font-bold">R$ {campaign.spend.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">Receita</span>
              <p className="text-2xl font-bold">R$ {campaign.revenue.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">ROAS</span>
              <p className={`text-2xl font-bold ${
                campaign.roas >= 4 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {campaign.roas.toFixed(2)}x
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-muted-foreground">CAC</span>
              <p className="text-2xl font-bold">R$ {campaign.cac}</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Detalhes de Conversão */}
          <div>
            <h4 className="font-medium mb-3">Funil da Campanha</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span>Cliques</span>
                <span className="font-medium">{campaign.clicks} (CTR: {campaign.ctr}%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Conversas Iniciadas</span>
                <span className="font-medium">{campaign.whatsapp_started}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Leads Qualificados</span>
                <span className="font-medium">{campaign.qualified}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Vendas</span>
                <span className="font-medium">{campaign.purchases} (LTV Médio: R$ {campaign.ltv})</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
           {/* Placeholder for leads list - Future Iteration: Fetch real leads */}
          <div>
            <h4 className="font-medium mb-3">Últimas Vendas</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Esta funcionalidade será ativada em breve para mostrar os leads individuais desta campanha.
            </p>
             <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between p-3 border rounded-md bg-white">
                        <div className="flex flex-col">
                            <span className="font-medium">Cliente Exemplo {i}</span>
                            <span className="text-xs text-gray-500">Há {i} dias</span>
                        </div>
                        <span className="font-medium text-green-600">R$ {1500 + i * 100},00</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
