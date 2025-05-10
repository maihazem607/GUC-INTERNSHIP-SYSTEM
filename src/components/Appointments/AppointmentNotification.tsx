import React, { useState, useEffect } from 'react';
import styles from './AppointmentNotification.module.css';

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
          return '✅';
        case 'appointment-rejected':
          return '❌';
        case 'call-started':
          return '📞';
        case 'call-ended':
          return '📴';
        case 'user-left-call':
          return '👋';
        default:
          break;
      }
    }

    // Default icons by type
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
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
        ✕
      </button>
    </div>
  );
};

export default AppointmentNotification;