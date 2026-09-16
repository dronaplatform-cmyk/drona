"use client";

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
};

// Example usage payload
export interface NotificationPayload {
  title: string;
  body?: string;
  icon?: string;
  image?: string;
  data?: any;
}

export const showNotification = async (payload: NotificationPayload) => {
  const hasPermission = await requestNotificationPermission();
  if (hasPermission) {
    sendNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || "/icons/icon-192x192.png",
      image: payload.image,
      data: payload.data,
    } as any);
  }
};
