"use client";
import { Bell } from 'lucide-react';
import './NotificationBell.css';
import { useNotification } from '../../context/NotificationContext';

export default function NotificationBell() {
  const { 
    unreadCount, 
    toggleNotificationPanel 
  } = useNotification();

  return (
    <div className="notification-container">
      {/* Bell Icon Button */}
      <button 
        onClick={toggleNotificationPanel}
        className="bell-button"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge" aria-hidden="true">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}