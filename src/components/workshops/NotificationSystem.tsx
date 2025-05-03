import React from 'react';
import styles from './NotificationSystem.module.css';

interface NotificationSystemProps {
  notifications: string[];
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications }) => {
  return (
    <div className={styles.notificationContainer}>
      {notifications.map((message, index) => (
        <div key={index} className={styles.notification}>
          <div className={styles.notificationTitle}>Workshop Notification</div>
          <div className={styles.notificationMessage}>{message}</div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;