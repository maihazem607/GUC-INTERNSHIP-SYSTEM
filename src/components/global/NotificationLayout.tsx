"use client";

import React, { ReactNode } from 'react';
import { NotificationProvider } from '../../context/NotificationContext';
import UnifiedNotificationSystem from './UnifiedNotificationSystem';

interface NotificationLayoutProps {
  children: ReactNode;
}

/**
 * NotificationLayout - Wraps the application with the NotificationProvider
 * and includes the UnifiedNotificationSystem component that handles
 * both toast notifications and notification panel.
 */
const NotificationLayout: React.FC<NotificationLayoutProps> = ({ children }) => {
  return (
    <NotificationProvider>
      {children}
      <UnifiedNotificationSystem />
    </NotificationProvider>
  );
};

export default NotificationLayout;
