'use client';

import { LeadPipelineBoard } from '@/components/leads/LeadPipelineBoard';
import { LeadDrawer } from '@/components/leads/LeadDrawer';

export default function PipelinePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground">
          Arraste os leads entre etapas para atualizar o funil
        </p>
      </div>

      <LeadPipelineBoard />

      <LeadDrawer />
    </div>
  );
}
