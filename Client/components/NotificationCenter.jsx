import React, { useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Package,
  AlertTriangle,
  Tag,
  Clock,
  Trash2,
  X,
  ExternalLink
} from 'lucide-react';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useClearAllNotificationsMutation
} from '../store/apiSlice.js';
import { getSocket } from '../utils/socket.js';

export const NotificationCenter = ({ isOpen, onClose, user, onSelectOrder }) => {
  const email = user?.email || localStorage.getItem('aura_user_email');
  const { data: notifications = [], refetch } = useGetNotificationsQuery(email, {
    skip: !email,
    pollingInterval: 15000,
  });

  const [markRead] = useMarkNotificationReadMutation();
  const [clearAll, { isLoading: clearing }] = useClearAllNotificationsMutation();

  useEffect(() => {
    if (!email) return;
    const socket = getSocket(localStorage.getItem('aura_token'), email);

    const handleNotification = (notif) => {
      refetch();
    };

    socket.on('notification.created', handleNotification);
    return () => {
      socket.off('notification.created', handleNotification);
    };
  }, [email, refetch]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER_STATUS':
        return <Package className="w-5 h-5 text-amber-600" />;
      case 'INVENTORY_ALERT':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'PROMO':
        return <Tag className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Header */}
        <div className="p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-100 rounded-lg text-stone-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">Notifications</h2>
              <p className="text-xs text-stone-500">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={() => clearAll(email)}
                disabled={clearing}
                className="text-xs font-medium text-stone-500 hover:text-rose-600 px-2 py-1 rounded hover:bg-stone-100 transition-colors flex items-center gap-1"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Bell className="w-12 h-12 stroke-1 mb-3 text-stone-300" />
              <p className="font-medium text-stone-600">No notifications yet</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs">
                Real-time updates regarding order transitions, dispatch tracking, and atelier alerts will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const id = notif.notificationId || notif._id || notif.id;
              return (
                <div
                  key={id}
                  onClick={() => {
                    if (!notif.isRead) markRead(id);
                    if (notif.orderId && onSelectOrder) {
                      onSelectOrder(notif.orderId);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-white border-stone-200 text-stone-600'
                      : 'bg-amber-50/50 border-amber-200/80 shadow-xs text-stone-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 bg-white rounded-lg border border-stone-200/60 shadow-2xs">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold truncate">{notif.title}</h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {notif.orderId && (
                          <span className="text-amber-800 font-medium flex items-center gap-0.5">
                            Order {notif.orderId}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
