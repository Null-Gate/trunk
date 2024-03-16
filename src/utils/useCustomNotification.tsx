import { notifications } from "@mantine/notifications";
import React from "react";

interface NotificationOptions {
  id?: string;
  title?: string;
  message?: string;
  color?: string;
  icon?: React.ReactNode;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useCustomNotification = (_options: NotificationOptions = {}) => {
  const showNotification = ({
    id = "default-id",
    title = "Default title",
    message = "Default message",
    color = "blue",
    position = "top-right",
    ...customOptions
  }: NotificationOptions) => {
    notifications.show({
      id,
      title,
      message,
      color,
      position,
      withCloseButton: true,
      onClose: () => console.log("unmounted"),
      onOpen: () => console.log("mounted"),
      autoClose: 5000,
      className: "my-notification-class",
      style: { backgroundColor: "white" },
      loading: false,
      ...customOptions,
    });
  };

  return showNotification;
};

export default useCustomNotification;
