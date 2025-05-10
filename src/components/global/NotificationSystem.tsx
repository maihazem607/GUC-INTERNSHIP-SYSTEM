import React, { useState, useEffect, useRef } from 'react';
import styles from './NotificationSystem.module.css';

// Notification constants
export const NOTIFICATION_CONSTANTS = {
  AUTO_DISMISS_TIME: 3000,
  HIDE_ANIMATION_TIME: 300,
  ICONS: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  },
  SOUND_PATH: '/sounds/notification.mp3'
};

export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Clear any existing timers when component unmounts or before setting a new one
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  const showNotification = (notificationProps: NotificationProps) => {
    // Clear any existing timers
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
  // Reference to the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Add effect to ensure notification is rendered in the DOM properly
  useEffect(() => {
    // Force repaint to ensure transitions work properly
    const reflow = document.body.offsetHeight;
    
    // Note: We're not automatically playing sound here anymore
    // Sound playback is now handled by the parent component
  }, [visible]);
    return (
    <>
      <div className={`${styles.notification} ${styles[type]} ${visible ? styles.show : styles.hide}`}>
        <span className={styles.icon}>{NOTIFICATION_CONSTANTS.ICONS[type]}</span>
        <div className={styles.message}>{message}</div>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <audio 
        ref={audioRef} 
        src={NOTIFICATION_CONSTANTS.SOUND_PATH} 
        preload="auto" 
        style={{ display: 'none' }} 
      />
    </>
  );
};

export default NotificationSystem;
