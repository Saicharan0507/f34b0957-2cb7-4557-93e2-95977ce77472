import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Notification } from '@/types';
import { Bell, Clock } from 'lucide-react';

interface HomeSectionProps {
  notifications: Notification[];
}

const HomeSection = ({ notifications }: HomeSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-primary bg-gradient-primary bg-clip-text text-transparent">
          {t('welcome_msg')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('home_desc')}
        </p>
      </div>

      <Card className="bg-gradient-card border-primary/20 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bell className="w-5 h-5" />
            {t('latest_notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-40 overflow-y-auto space-y-3">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t('no_notifications')}
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border-l-4 border-primary"
                >
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.date.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeSection;