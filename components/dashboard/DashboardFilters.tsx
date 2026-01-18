'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DateRangePreset, DashboardFilters } from '@/types/googleAdsDashboard';

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function DashboardFilters({ filters, onFiltersChange, onRefresh, isLoading }: DashboardFiltersProps) {
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handlePresetChange = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      onFiltersChange({
        ...filters,
        dateRange: { preset },
      });
    }
  };

  const currentPreset = filters.dateRange.preset || 'custom';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Período</label>
            <Select value={currentPreset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="14d">Últimos 14 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="mtd">Mês atual (MTD)</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showCustomRange && (
            <>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">De</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? format(new Date(filters.dateRange.from), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from ? new Date(filters.dateRange.from) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          onFiltersChange({
                            ...filters,
                            dateRange: { ...filters.dateRange, from: format(date, 'yyyy-MM-dd') },
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Até</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? format(new Date(filters.dateRange.to), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to ? new Date(filters.dateRange.to) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          onFiltersChange({
                            ...filters,
                            dateRange: { ...filters.dateRange, to: format(date, 'yyyy-MM-dd') },
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <Button onClick={onRefresh} disabled={isLoading} className="shrink-0">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
