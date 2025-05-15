"use client";
import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import styles from './NotificationSystem.module.css';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';

/**
 * UnifiedNotificationSystem - Combines toast notifications and notification panel
 * to provide a consistent notification experience across the application.
 */
const UnifiedNotificationSystem: React.FC = () => {
  const { 
    toastNotification, 
    toastVisible, 
    hideToast,
    notifications,
    notificationPanelOpen,
    closeNotificationPanel,
    markAsRead,
    markAllAsRead
  } = useNotification();

  const renderToastIcon = () => {
    if (!toastNotification) return null;
    
    switch (toastNotification.type) {
      case 'success':
        return <CheckCircle size={18} color="#10b981" />;
      case 'error':
        return <XCircle size={18} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      case 'info':
        return <Info size={18} color="#3b82f6" />;
      default:
        return <Info size={18} color="#3b82f6" />;
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastNotification && (
        <div 
          className={`${styles.notification} ${styles[toastNotification.type]} ${toastVisible ? styles.show : styles.hide}`}
          aria-live="polite"
        >
          <span className={styles.icon}>{renderToastIcon()}</span>
          <div className={styles.message}>{toastNotification.message}</div>
          <button 
            className={styles.closeButton} 
            onClick={hideToast}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Notification Panel */}
      {notificationPanelOpen && (
        <NotificationsPanel
          notifications={notifications}
          onClose={closeNotificationPanel}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}
    </>
  );
};

export default UnifiedNotificationSystem;
