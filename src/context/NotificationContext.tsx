"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationContextType {
  notification: {
    message: string;
    type: NotificationType;
  } | null;
  visible: boolean;
  showNotification: (params: { message: string; type: NotificationType }) => void;
  hideNotification: () => void;
}

// Create context with a default value that's safer for type checking
const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  visible: false,
  showNotification: () => {},
  hideNotification: () => {}
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  const [visible, setVisible] = useState(false);

  const showNotification = ({ message, type }: { message: string; type: NotificationType }) => {
    setNotification({ message, type });
    setVisible(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  };

  const hideNotification = () => {
    setVisible(false);
    // Reset notification after animation completes
    setTimeout(() => {
      setNotification(null);
    }, 300);
  };

  return (
    <NotificationContext.Provider 
      value={{
        notification,
        visible,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
