import React from 'react';
import styles from './NotificationsPanel.module.css';
import { PersistentNotification } from '../../context/NotificationContext';
import { X, FileText, RefreshCw, Info, Mail, Calendar, AlertTriangle } from 'lucide-react';

interface NotificationsPanelProps {
    notifications: PersistentNotification[];
    onClose: () => void;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
    notifications,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead
}) => {
    const getNotificationIcon = (type: string) => {
        switch(type) {
            case 'application':
                return <FileText size={16} color="#4c51bf" />;
            case 'status-change':
                return <RefreshCw size={16} color="#4c51bf" />;
            case 'appointment':
                return <Calendar size={16} color="#4c51bf" />;
            case 'system':
            default:
                return <Info size={16} color="#4c51bf" />;
        }
    };

    const handleNotificationClick = (notification: PersistentNotification) => {
        // Mark as read
        onMarkAsRead(notification.id);
        
        // Navigate to actionUrl if provided
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
        }
    };
    
    return (
        <div className={styles.notificationsPanelOverlay}>
            <div className={styles.notificationsPanel}>
                <div className={styles.notificationsPanelHeader}>
                    <h3>Notifications</h3>
                    <div className={styles.notificationActions}>
                        <button
                            className={styles.markAllReadButton}
                            onClick={onMarkAllAsRead}
                        >
                            Mark all as read
                        </button>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
                <div className={styles.notificationsList}>
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className={styles.notificationIcon}>
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className={styles.notificationContent}>
                                    {notification.title && (
                                        <p className={styles.notificationTitle}>{notification.title}</p>
                                    )}
                                    <p className={styles.notificationMessage}>{notification.message}</p>
                                    <p className={styles.notificationTime}>
                                        {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {notification.timestamp.toLocaleDateString()}
                                    </p>
                                    <div className={styles.notificationMeta}>
                                        {notification.emailSent && (
                                            <span className={styles.emailSentBadge}>
                                                <Mail size={14} color="#4c51bf" style={{ marginRight: '4px' }} /> Email sent
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.notificationStatus}>
                                    {!notification.read && (
                                        <span className={styles.unreadDot}></span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyNotifications}>
                            <p>No notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPanel;
