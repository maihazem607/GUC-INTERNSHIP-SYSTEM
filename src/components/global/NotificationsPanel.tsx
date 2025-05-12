import React from 'react';
import styles from './NotificationsPanel.module.css';
import { Notification } from '../../components/Companyy/types';
import { X, FileText, RefreshCw, Info, Mail } from 'lucide-react';

interface NotificationsPanelProps {
    notifications: Notification[];
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
                                onClick={() => onMarkAsRead(notification.id)}
                            >
                                <div className={styles.notificationIcon}>
                                    {notification.type === 'application' ? <FileText size={16} color="#4c51bf" /> :
                                        notification.type === 'status-change' ? <RefreshCw size={16} color="#4c51bf" /> :
                                            <Info size={16} color="#4c51bf" />}
                                </div>
                                <div className={styles.notificationContent}>
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
