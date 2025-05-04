import React, { useEffect, useState } from 'react';
import styles from './NotificationSystem.module.css';

interface NotificationProps {
  message: string;
  type: string;
  onClose: () => void;
  duration?: number;
}

const NotificationSystem: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  onClose,
  duration = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for fade-out animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  return (
    <div 
      className={`${styles.notification} ${styles[type]} ${isVisible ? styles.show : styles.hide}`}
    >
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} onClick={onClose}>×</button>
    </div>
  );
};

export default NotificationSystem;