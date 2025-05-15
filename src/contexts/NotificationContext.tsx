"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import NotificationSystem, { NotificationProps, NOTIFICATION_CONSTANTS } from '../components/global/NotificationSystem';

interface NotificationContextType {
    showNotification: (notification: NotificationProps) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationProps | null>(null);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <NotificationSystem
                    message={notification.message}
                    type={notification.type}
                    visible={visible}
                    onClose={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};

export default NotificationContext; 