import React, { useState, useEffect } from 'react';
import styles from './AppointmentNotification.module.css';
import {
  CheckCircle, XCircle, AlertTriangle, Info,
  Phone, PhoneOff, Hand, X
} from 'lucide-react';

// Types for different notification categories
type NotificationType = 'success' | 'error' | 'info' | 'warning';
type NotificationAction = 'appointment-accepted' | 'appointment-rejected' | 'call-started' | 'call-ended' | 'user-left-call';

interface AppointmentNotificationProps {
  message: string;
  type: NotificationType;
  action?: NotificationAction;
  visible: boolean;
  onClose: () => void;
  userName?: string;
  appointmentTitle?: string;
}

const AppointmentNotification: React.FC<AppointmentNotificationProps> = ({
  message,
  type,
  action,
  visible,
  onClose,
  userName,
  appointmentTitle
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000); // Auto dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Get appropriate icon based on notification type and action
  const getNotificationIcon = () => {
    if (action) {
      switch (action) {
        case 'appointment-accepted':
          return <CheckCircle size={18} color="#10b981" />;
        case 'appointment-rejected':
          return <XCircle size={18} color="#ef4444" />;
        case 'call-started':
          return <Phone size={18} color="#4c51bf" />;
        case 'call-ended':
          return <PhoneOff size={18} color="#4c51bf" />;
        case 'user-left-call':
          return <Hand size={18} color="#4c51bf" />;
        default:
          break;
      }
    }

    // Default icons by type
    switch (type) {
      case 'success':
        return <CheckCircle size={18} color="#10b981" />;
      case 'error':
        return <XCircle size={18} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      case 'info':
      default:
        return <Info size={18} color="#3b82f6" />;
    }
  };

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${isVisible ? styles.visible : styles.hidden}`}
      role="alert"
    >
      <div className={styles.notificationIcon}>
        {getNotificationIcon()}
      </div>
      <div className={styles.notificationContent}>
        {userName && (
          <div className={styles.notificationContext}>
            <span className={styles.userName}>{userName}</span>
            {appointmentTitle && (
              <span className={styles.appointmentTitle}>{appointmentTitle}</span>
            )}
          </div>
        )}
        <div className={styles.notificationMessage}>{message}</div>
      </div>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AppointmentNotification;