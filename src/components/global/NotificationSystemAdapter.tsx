"use client";
import React from 'react';
import { useNotification as useUnifiedNotification } from '../../context/NotificationContext';

// This adapter component provides backward compatibility with the old notification system
// while using the unified notification context under the hood

// Export the hook for backward compatibility
export const useNotification = useUnifiedNotification;

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onClose: () => void;
}

const NotificationSystem: React.FC<NotificationProps> = ({
  message,
  type,
  visible,
  onClose,
}) => {
  const { showToast } = useUnifiedNotification();

  // When this component renders with visible=true, show a toast
  React.useEffect(() => {
    if (visible && message) {
      showToast({ message, type });
      
      // Call onClose to let the parent component know
      // that the notification is being handled
      onClose();
    }
  }, [visible, message, type, showToast, onClose]);

  // The component itself doesn't render anything visible
  // as the actual notification is handled by the UnifiedNotificationSystem
  return null;
};

export default NotificationSystem;

// Export the NOTIFICATION_CONSTANTS for backward compatibility
export const NOTIFICATION_CONSTANTS = {
  AUTO_DISMISS_TIME: 5000, // 5 seconds
  HIDE_ANIMATION_TIME: 300  // 0.3 seconds
};