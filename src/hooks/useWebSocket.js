import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useWebSocket = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`${websocketUrl}?username=${encodeURIComponent(user.email)}`);

    ws.onopen = () => {
      console.log(`Connected to WebSocket as ${user.email}`);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "event_start" || data.type === "event_upcoming") {
        const newNotification = {
          id: data.event?._id || Date.now(), 
          message: data.message,
          type: data.type,
          event: data.event
        };

        setNotifications((prev) => {
          const existingIndex = prev.findIndex((notif) => notif.id === newNotification.id);
          if (existingIndex !== -1) {
            const updatedNotifications = [...prev];
            updatedNotifications[existingIndex] = newNotification;
            return updatedNotifications;
          }
          return [...prev, newNotification];
        });
      }
    };

    ws.onclose = () => {
      console.log(`Disconnected from WebSocket as ${user.email}`);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return notifications;
};

export default useWebSocket;