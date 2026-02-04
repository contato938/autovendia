import { DemandList } from '@/components/demand/DemandList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demanda vs Estoque | AutoVendia',
  description: 'Relatório de produtos procurados sem estoque.',
};

export default function DemandPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Demanda vs Estoque</h2>
          <p className="text-muted-foreground">
            Visualize produtos que estão sendo procurados mas não foram vendidos (potencial falta de estoque).
          </p>
        </div>
      </div>
      <DemandList />
    </div>
  );
}
