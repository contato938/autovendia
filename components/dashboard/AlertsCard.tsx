import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlertItem } from '@/types/googleAdsDashboard';
import { Badge } from '@/components/ui/badge';

interface AlertsCardProps {
  alerts: AlertItem[];
}

export function AlertsCard({ alerts }: AlertsCardProps) {
  if (!alerts || alerts.length === 0) return null;

  const getIcon = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgClass = (severity: AlertItem['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-100';
      case 'warning': return 'bg-yellow-50 border-yellow-100';
      case 'success': return 'bg-green-50 border-green-100';
      case 'info': return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`flex items-start gap-3 p-3 rounded-lg border ${getBgClass(alert.severity)}`}
          >
            <div className="mt-0.5 shrink-0">{getIcon(alert.severity)}</div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
              {alert.detail && (
                <p className="text-sm text-gray-600 mt-0.5">{alert.detail}</p>
              )}
            </div>
            {alert.metric && (
              <Badge variant="outline" className="bg-white/50 text-xs">
                {alert.metric}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
