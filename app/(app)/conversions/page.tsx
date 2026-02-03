'use client';

import { OfflineConversionsCard } from '@/components/dashboard/OfflineConversionsCard';
import { useQuery } from '@tanstack/react-query';
import { dashboardGoogleService } from '@/services/dashboardGoogle';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { DashboardFilters as FilterType } from '@/types/googleAdsDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConversionsPage() {
  const [filters] = useState<FilterType>({ dateRange: { preset: '30d' } });
  const { selectedTenantId } = useStore();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboardGoogle', filters, selectedTenantId],
    queryFn: () => dashboardGoogleService.getDashboardSummary(filters, selectedTenantId || undefined),
    enabled: !!selectedTenantId,
  });

  if (isLoading || !summary) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Conversões & Tracking</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
         <OfflineConversionsCard offline={summary.offline} />
         <Card>
            <CardHeader><CardTitle>Status do Pixel</CardTitle></CardHeader>
            <CardContent>
               <div className="flex items-center gap-2 text-green-600 font-medium">
                  <div className="h-2 w-2 rounded-full bg-green-600"></div>
                  Pixel Ativo (Server-Side)
               </div>
               <p className="text-sm text-muted-foreground mt-2">
                 Eventos de Purchase e Lead sendo enviados corretamente via API de Conversões.
               </p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
