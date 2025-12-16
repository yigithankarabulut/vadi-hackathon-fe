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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#659EB3]">
          <Bell className="h-5 w-5" />
          Uyarılar ve Bildirimler
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center text-[#8B7B8E] py-8">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Henüz uyarı bulunmuyor</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id} className={getAlertColor(alert.type)}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#659EB3]">{alert.aircraftName}</span>
                      <span className="text-xs text-[#8B7B8E]">
                        {alert.timestamp.toLocaleTimeString('tr-TR')}
                      </span>
                    </div>
                    <AlertDescription className="text-[#8B7B8E]">{alert.message}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
