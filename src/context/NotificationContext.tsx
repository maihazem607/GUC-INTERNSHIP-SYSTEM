"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';

export type ToastNotificationType = 'success' | 'error' | 'warning' | 'info';

// Constants for notifications
export const NOTIFICATION_CONSTANTS = {
  AUTO_DISMISS_TIME: 5000,   // 5 seconds
  HIDE_ANIMATION_TIME: 300,  // 0.3 seconds
  SOUND_PATH: '/sounds/notification.mp3'
};

// For notifications that appear in the notification panel/bell
export interface PersistentNotification {
  id: string;
  message: string;
  type: 'application' | 'status-change' | 'system' | 'appointment';
  timestamp: Date;
  read: boolean;
  emailSent?: boolean;
  actionUrl?: string;
  title?: string;
}

// Simplified API for both new and legacy code
export interface NotificationContextType {
  // Toast notification (bottom right corner)
  toastNotification: {
    message: string;
    type: ToastNotificationType;
  } | null;
  toastVisible: boolean;
  showToast: (params: { message: string; type: ToastNotificationType }) => void;
  hideToast: () => void;
  
  // Legacy compatibility methods (same as above but with different names)
  notification: {
    message: string;
    type: ToastNotificationType;
  } | null;
  visible: boolean;
  showNotification: (params: { message: string; type: ToastNotificationType }) => void;
  hideNotification: () => void;
  
  // Persistent notifications (notification bell)
  notifications: PersistentNotification[];
  unreadCount: number;
  notificationPanelOpen: boolean;
  toggleNotificationPanel: () => void;
  closeNotificationPanel: () => void;
  addNotification: (notification: Omit<PersistentNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

// Sound for notifications
const NOTIFICATION_SOUND_PATH = '/sounds/notification.mp3';

// Create context with default values
export const NotificationContext = createContext<NotificationContextType>({
  // Toast notifications
  toastNotification: null,
  toastVisible: false,
  showToast: () => {},
  hideToast: () => {},
  
  // Legacy compatibility
  notification: null,
  visible: false,
  showNotification: () => {},
  hideNotification: () => {},
  
  // Persistent notifications
  notifications: [],
  unreadCount: 0,
  notificationPanelOpen: false,
  toggleNotificationPanel: () => {},
  closeNotificationPanel: () => {},
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {}
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Toast notification state
  const [toastNotification, setToastNotification] = useState<{ message: string; type: ToastNotificationType } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  
  // Persistent notifications state
  const [notifications, setNotifications] = useState<PersistentNotification[]>([]);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  
  // Audio ref for notification sound
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Timer ref for auto-hiding toast
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(NOTIFICATION_SOUND_PATH);
    audioRef.current.preload = 'auto';
    
    // Cleanup timers on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  // Toast notification methods
  const showToast = ({ message, type }: { message: string; type: ToastNotificationType }) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setToastNotification({ message, type });
    setToastVisible(true);
    
    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Error playing notification sound:", err));
    }
    
    // Auto-hide after 10 seconds (increased from 5 for better visibility)
    timerRef.current = setTimeout(() => {
      hideToast();
    }, NOTIFICATION_CONSTANTS.AUTO_DISMISS_TIME);
  };

  const hideToast = () => {
    setToastVisible(false);
    // Reset toast notification after animation completes
    setTimeout(() => {
      setToastNotification(null);
    }, 300);
  };
  
  // Persistent notifications methods
  const toggleNotificationPanel = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };
  
  const closeNotificationPanel = () => {
    setNotificationPanelOpen(false);
  };
  
  const addNotification = (notificationData: Omit<PersistentNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: PersistentNotification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play sound for new notification
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Error playing notification sound:", err));
    }
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  return (
    <NotificationContext.Provider 
      value={{
        // Modern API
        toastNotification,
        toastVisible,
        showToast,
        hideToast,
        
        // Legacy compatibility API
        notification: toastNotification,
        visible: toastVisible,
        showNotification: showToast,
        hideNotification: hideToast,
        
        // Persistent notifications
        notifications,
        unreadCount,
        notificationPanelOpen,
        toggleNotificationPanel,
        closeNotificationPanel,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification
      }}
    >
      {children}
      <audio 
        ref={audioRef} 
        src={NOTIFICATION_SOUND_PATH} 
        preload="auto" 
        style={{ display: 'none' }} 
      />
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
