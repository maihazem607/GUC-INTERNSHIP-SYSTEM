# Unified Notification System

This document explains how to use the unified notification system in the GUC-INTERNSHIP-SYSTEM.

## Overview

The unified notification system provides a consistent way to show notifications across the application:
- Toast notifications appear in the bottom right corner
- Notification bell in the navigation shows unread count
- Clicking the bell opens a notifications panel

## Using Notifications in Your Components

Import and use the unified notification system directly:

```tsx
import { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';

const MyComponent = () => {
  const notification = useContext(NotificationContext);
  
  // Show a toast notification (temporary)
  const showToastExample = () => {
    notification.showToast({
      message: 'Operation completed successfully!',
      type: 'success' // 'success', 'error', 'warning', 'info'
    });
  };
  
  // Add a persistent notification (goes to notification panel)
  const addPersistentExample = () => {
    notification.addNotification({
      title: 'New Application',
      message: 'A student has applied to your internship',
      type: 'application', // 'application', 'status-change', 'system', 'appointment'
      actionUrl: '/applications/123', // Optional link when clicked
    });
  };
  
  return (
    <div>
      <button onClick={showToastExample}>Show Toast</button>
      <button onClick={addPersistentExample}>Add Notification</button>
    </div>
  );
};

function MyComponent() {
  const { showToast, addNotification } = useNotification();
  
  // Show a toast notification (temporary popup)
  const handleShowToast = () => {
    showToast({
      message: "This is a success message!",
      type: "success" // 'success', 'error', 'warning', or 'info'
    });
  };
  
  // Add a persistent notification (appears in notification panel)
  const handleAddNotification = () => {
    addNotification({
      message: "You have a new message", 
      type: "system", // 'application', 'status-change', 'system', or 'appointment'
      title: "New Message Alert" // optional title
    });
  };
  
  return (...);
}

## Features

1. **Toast Notifications**
   - Short-lived notifications that appear in bottom right
   - Auto-dismiss after 5 seconds
   - Types: success, error, warning, info

2. **Persistent Notifications**
   - Appear in the notification panel when bell icon is clicked
   - Can include more detailed information
   - Show unread count on bell icon
   - Can be marked as read individually or all at once

3. **Notification Bell**
   - Shows count of unread notifications 
   - Clicking opens the notifications panel
   - Red badge when there are unread notifications

4. **Notification Panel**
   - Lists all persistent notifications
   - Can mark as read or delete notifications
   - Shows notification time and type

## Architecture

The notification system consists of:

1. `NotificationContext.tsx` - Core context provider for the unified system
2. `UnifiedNotificationSystem.tsx` - Component that renders both toast and panel
3. `NotificationBell.tsx` - Bell icon that shows unread count and opens panel
4. `NotificationsPanel.tsx` - Panel showing persistent notifications
5. `NotificationSystemAdapter.tsx` - Adapter for backward compatibility

## Available Notification Types

### Toast Notifications
- `success` - Green color, used for successful operations
- `error` - Red color, used for errors
- `warning` - Yellow color, used for warnings
- `info` - Blue color, used for information

### Persistent Notifications
- `application` - Related to student applications
- `status-change` - Status changes in applications or internships
- `system` - System notifications
- `appointment` - Meeting and appointment notifications