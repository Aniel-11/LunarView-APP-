import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem('notificationsEnabled') === 'true';
    setNotificationsEnabled(saved);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const enableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      setNotificationsEnabled(true);
      localStorage.setItem('notificationsEnabled', 'true');
      sendTestNotification();
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    localStorage.setItem('notificationsEnabled', 'false');
  };

  const sendTestNotification = () => {
    if (notificationsEnabled && Notification.permission === 'granted') {
      new Notification('Lunar View', {
        body: 'Notifications are now enabled!',
        icon: 'https://customer-assets.emergentagent.com/job_solarlunarapp/artifacts/99c984g7_IMG_0233.jpg',
      });
    }
  };

  const sendAstronomyNotification = (title, body) => {
    if (notificationsEnabled && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: 'https://customer-assets.emergentagent.com/job_solarlunarapp/artifacts/99c984g7_IMG_0233.jpg',
      });
    }
  };

  return (
    <NotificationContext.Provider value={{
      notificationsEnabled,
      permission,
      enableNotifications,
      disableNotifications,
      sendAstronomyNotification,
      sendTestNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}