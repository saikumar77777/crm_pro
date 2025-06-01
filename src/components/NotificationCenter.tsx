
import React, { useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

const NotificationCenter = () => {
  const { notifications, loading, markAsRead, markAllAsRead, refetch } = useNotifications();

  useEffect(() => {
    // Refetch notifications when component mounts
    refetch();
  }, [refetch]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error':
        return <X className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30';
      case 'warning':
        return 'border-amber-500/30';
      case 'error':
        return 'border-red-500/30';
      default:
        return 'border-blue-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-crm-electric" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-crm-electric/20 to-crm-emerald/20">
            <Bell className="w-6 h-6 text-crm-electric" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-crm-text-white">Notifications</h2>
            <p className="text-crm-text-secondary">
              {notifications.filter(n => !n.is_read).length} unread notifications
            </p>
          </div>
        </div>

        {notifications.some(n => !n.is_read) && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="border-crm-tertiary text-crm-text-white hover:bg-crm-tertiary"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="crm-card p-8 text-center">
            <Bell className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-crm-text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-crm-text-secondary">
              You'll see important updates and alerts here when they arrive.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`crm-card p-4 border-l-4 transition-all duration-200 hover:bg-crm-tertiary/20 cursor-pointer ${
                    getNotificationBorderColor(notification.type)
                  } ${!notification.is_read ? 'bg-crm-tertiary/10' : ''}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${
                          notification.is_read ? 'text-crm-text-secondary' : 'text-crm-text-white'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-crm-electric rounded-full"></div>
                          )}
                          <span className="text-xs text-crm-text-secondary">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${
                        notification.is_read ? 'text-crm-text-secondary' : 'text-crm-text-white/80'
                      }`}>
                        {notification.message}
                      </p>

                      {notification.action_url && (
                        <div className="mt-3">
                          <a
                            href={notification.action_url}
                            className="inline-flex items-center text-sm text-crm-electric hover:text-crm-electric/80 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Details →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
