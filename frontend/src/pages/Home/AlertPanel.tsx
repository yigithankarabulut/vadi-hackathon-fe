import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertCircle, Bell, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../../ui/badge';
import type { AlertPanelProps } from '../../types';

export function AlertPanel({ alerts }: AlertPanelProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <section aria-labelledby="alerts-title">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle id="alerts-title" className="flex items-center gap-2 text-[#659EB3] text-base">
            <Bell className="h-4 w-4" aria-hidden="true" />
            Uyarılar
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-auto text-xs" aria-label={`${alerts.length} uyarı mevcut`}>
                {alerts.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 max-h-[300px] overflow-y-auto" role="log" aria-live="polite" aria-atomic="false">
            {alerts.length === 0 ? (
              <div className="text-center text-[#8B7B8E] py-6" role="status">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" aria-hidden="true" />
                <p className="text-sm">Henüz uyarı bulunmuyor</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Alert 
                  key={alert.id} 
                  className={`${getAlertColor(alert.type)} py-2 px-3`}
                  role="alert"
                  aria-labelledby={`alert-${alert.id}-aircraft`}
                >
                  <div className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-0.5 flex-shrink-0">{getAlertIcon(alert.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span id={`alert-${alert.id}-aircraft`} className="font-semibold text-[#659EB3] text-xs">{alert.aircraftName}</span>
                        <time className="text-[10px] text-[#8B7B8E]" dateTime={alert.timestamp.toISOString()}>
                          {alert.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                      <AlertDescription className="text-[#8B7B8E] text-[11px] leading-snug mt-0.5">{alert.message}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
