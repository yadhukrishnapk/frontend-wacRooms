import { useEffect } from 'react';
import { useAuth } from './useAuth';

const useBrowserNotifications = (notifications) => {
  const { user } = useAuth();

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notifications');
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Notification permission denied');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    const createBrowserNotification = (notification) => {
      if (Notification.permission === 'granted') {
        new Notification('Event Notification', {
          body: notification.message,
          icon: '/download.png', // Optional: Add your app's logo
          tag: notification.id.toString() // Helps prevent duplicate notifications
        });
      }
    };

    // Call permission request
    requestNotificationPermission();

    // Create notifications for new events
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      createBrowserNotification(latestNotification);
    }
  }, [notifications, user]);
};

export default useBrowserNotifications;