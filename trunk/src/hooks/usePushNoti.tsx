import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotiState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
}

const usePushNoti = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notiListener = useRef<Notifications.Subscription>();
  const resListener = useRef<Notifications.Subscription>();

  const registerForPushNotificationAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus != "granted") {
        const { status }: any = Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus != "granted") {
        alert("Failed to get notification");
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      if (Platform.OS == "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      return token;
    } else {
      console.log("ERROR: Please use physical device");
    }
  };
  useEffect(() => {
    registerForPushNotificationAsync().then((token) => setExpoPushToken(token));
    notiListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(JSON.stringify(notification), "noti");
        setNotification(notification);
      }
    );
    resListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => console.log(response)
    );

    return () => {
      Notifications.removeNotificationSubscription(notiListener.current!);
      Notifications.removeNotificationSubscription(resListener.current!);
    };
  }, []);

  return { expoPushToken, notification };
};

export default usePushNoti;
