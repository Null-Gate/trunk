import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";

// components
import Notification from "../components/notification/Notification";

// dummy data
import { NOTI_DATA } from "../config/post_data";
import usePushNoti from "../hooks/usePushNoti";
import useUserStore from "../store/userStore";
import { useFocusEffect } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const NotificationScreen = () => {
  // const { expoPushToken, notification } = usePushNoti();
  // console.log(expoPushToken, "expopush token");
  // const data = JSON.stringify(notification, undefined, 2);
  const { setToken, user } = useUserStore();
  const [notiDatas, setNotiDatas] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      const ws = new WebSocket(`ws://34.83.96.230:9692/noti/_/${user?.token}`);

      ws.onopen = () => {
        // Request different data by sending a message to the server
        ws.send(
          JSON.stringify({
            event: "Notification",
          })
        );
      };

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data && data.data) {
          setNotiDatas(data.data);
          console.log(data.data);
        }
      };

      return () => {
        ws.onclose = () => {
          console.log("ws is disconnected");
        };
      };
    }, [])
  );

  useEffect(() => {
    setToken(user?.token);
  }, []);

  console.log(notiDatas, "notiDatas");

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.listContainer}>
        <Notification
          creator={notiDatas[0]?.id?.tb}
          message={notiDatas[1]?.data}
          createdDate={"date ??"}
        />
      </ScrollView>
      {/* <FlatList
        style={styles.listContainer}
        data={NOTI_DATA}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <Notification
              creator={item.user.name}
              message={item.message}
              createdDate={item.created_date}
            />
          );
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  filterTapContainer: {},
  filterTap: {
    width: windowWidth / 2,
  },
  listContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});

export default NotificationScreen;
