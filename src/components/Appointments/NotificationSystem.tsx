import React, { useEffect } from 'react';
import styles from './NotificationSystem.module.css';
import { NotificationProps } from './types';

const NotificationSystem: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const getIcon = () => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': 
      default: return 'ℹ️';
    }
  };
  
  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.notificationContent}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeButton} onClick={onClose}>×</button>
    </div>
  );
};

export default NotificationSystem;
