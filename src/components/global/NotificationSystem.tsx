// import React, { useState, useEffect, useRef } from 'react';
// import styles from './NotificationSystem.module.css';

// // Notification constants
// export const NOTIFICATION_CONSTANTS = {
//   AUTO_DISMISS_TIME: 3000,
//   HIDE_ANIMATION_TIME: 300,
//   ICONS: {
//     success: '✅',
//     error: '❌',
//     warning: '⚠️',
//     info: 'ℹ️'
//   }
// };

// export interface NotificationProps {
//   message: string;
//   type: 'success' | 'error' | 'warning' | 'info';
//   onClose?: () => void;
// }

// export const useNotification = () => {
//   const [notification, setNotification] = useState<NotificationProps | null>(null);
//   const [visible, setVisible] = useState(false);
//   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
//   // Clear any existing timers when component unmounts or before setting a new one
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, []);

//   const showNotification = (notificationProps: NotificationProps) => {
//     // Clear any existing timers
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }
    
//     setNotification(notificationProps);
//     setVisible(true);
    
//     // Auto-dismiss the notification after the specified time
//     timerRef.current = setTimeout(() => {
//       hideNotification();
//     }, NOTIFICATION_CONSTANTS.AUTO_DISMISS_TIME);
//   };

//   const hideNotification = () => {
//     setVisible(false);
    
//     // Clear existing timer if any
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }
    
//     // Set timer to remove notification after animation completes
//     timerRef.current = setTimeout(() => {
//       setNotification(null);
//     }, NOTIFICATION_CONSTANTS.HIDE_ANIMATION_TIME);
//   };

//   return {
//     notification,
//     visible,
//     showNotification,
//     hideNotification
//   };
// };

// const NotificationSystem: React.FC<NotificationProps & { visible: boolean, onClose: () => void }> = ({
//   message,
//   type,
//   visible,
//   onClose
// }) => {
//   // Add effect to ensure notification is rendered in the DOM properly
//   useEffect(() => {
//     // Force repaint to ensure transitions work properly
//     const reflow = document.body.offsetHeight;
//   }, [visible]);
  
//   return (
//     <div className={`${styles.notification} ${styles[type]} ${visible ? styles.show : styles.hide}`}>
//       <span className={styles.icon}>{NOTIFICATION_CONSTANTS.ICONS[type]}</span>
//       <div className={styles.message}>{message}</div>
//       <button className={styles.closeButton} onClick={onClose}>×</button>
//     </div>
//   );
// };

// export default NotificationSystem;

import React, { useState, useEffect, useRef } from 'react';
import styles from './NotificationSystem.module.css';

// Notification constants
export const NOTIFICATION_CONSTANTS = {
  AUTO_DISMISS_TIME: 3000,
  HIDE_ANIMATION_TIME: 300,
  PERIODIC_NOTIFICATION_INTERVAL: 20 * 1000, // 20 seconds
  ICONS: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
};

export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export interface NotificationOptions {
  periodicNotification?: {
    enabled: boolean;
    message?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  };
}

export const useNotification = (options: NotificationOptions = {}) => {
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const periodicTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear any existing timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (periodicTimerRef.current) {
        clearInterval(periodicTimerRef.current);
      }
    };
  }, []);

  // Periodic notification logic
  useEffect(() => {
    if (options.periodicNotification?.enabled) {
      periodicTimerRef.current = setInterval(() => {
        showNotification({
          message: options.periodicNotification?.message || 'Stay updated with the latest opportunities!',
          type: options.periodicNotification?.type || 'info'
        });
      }, NOTIFICATION_CONSTANTS.PERIODIC_NOTIFICATION_INTERVAL);

      return () => {
        if (periodicTimerRef.current) {
          clearInterval(periodicTimerRef.current);
        }
      };
    }
  }, [options.periodicNotification?.enabled, options.periodicNotification?.message, options.periodicNotification?.type]);

  const showNotification = (notificationProps: NotificationProps) => {
    // Clear any existing auto-dismiss timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setNotification(notificationProps);
    setVisible(true);
    
    // Auto-dismiss the notification after the specified time
    timerRef.current = setTimeout(() => {
      hideNotification();
    }, NOTIFICATION_CONSTANTS.AUTO_DISMISS_TIME);
  };

  const hideNotification = () => {
    setVisible(false);
    
    // Clear existing timer if any
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set timer to remove notification after animation completes
    timerRef.current = setTimeout(() => {
      setNotification(null);
    }, NOTIFICATION_CONSTANTS.HIDE_ANIMATION_TIME);
  };

  return {
    notification,
    visible,
    showNotification,
    hideNotification
  };
};

const NotificationSystem: React.FC<NotificationProps & { visible: boolean, onClose: () => void }> = ({
  message,
  type,
  visible,
  onClose
}) => {
  // Add effect to ensure notification is rendered in the DOM properly
  useEffect(() => {
    // Force repaint to ensure transitions work properly
    const reflow = document.body.offsetHeight;
  }, [visible]);
  
  return (
    <div className={`${styles.notification} ${styles[type]} ${visible ? styles.show : styles.hide}`}>
      <span className={styles.icon}>{NOTIFICATION_CONSTANTS.ICONS[type]}</span>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} onClick={onClose}>×</button>
    </div>
  );
};

export default NotificationSystem;