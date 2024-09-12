import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";

// react navigation
import { useFocusEffect, useNavigation } from "@react-navigation/native";

// components
import Post from "../components/newFeed/Post";
import PostModal from "../components/newFeed/PostModal";
import DriverLists from "../components/newFeed/DriverLists";

// dummy data
import { FEED_DATA } from "../config/post_data";
import useUserStore from "../store/userStore";

interface PostModalInfo {
  modalVisible: boolean;
}

const NewFeedScreen = () => {
  const { setToken, user } = useUserStore();
  const [feedDatas, setFeedDatas] = useState<any>([]);
  const [postModalInfo, setPostModalInfo] = useState<PostModalInfo>({
    modalVisible: false,
  });

  const openPostModal = () => {
    setPostModalInfo((prevInfo) => {
      const newInfo = {
        ...prevInfo,
        modalVisible: true,
      };
      return newInfo;
    });
  };

  const closePostModal = () => {
    setPostModalInfo((prevInfo) => {
      const newInfo = {
        ...prevInfo,
        modalVisible: false,
      };
      return newInfo;
    });
  };

  useFocusEffect(
    useCallback(() => {
      const ws = new WebSocket(`ws://34.83.96.230:9692/noti/_/${user?.token}`);

      ws.onopen = () => {
        // Request different data by sending a message to the server
        ws.send(
          JSON.stringify({
            event: "NewFeed",
          })
        );
      };

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data && data.data) {
          setFeedDatas(data.data);
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

  // console.log("New Feed", feedDatas);

  return (
    <>
      <View style={styles.container}>
        <FlatList
          style={styles.listContainer}
          data={feedDatas}
          showsVerticalScrollIndicator={false}
          windowSize={10}
          maxToRenderPerBatch={5}
          renderItem={({ item }) => {
            return (
              <Post
                creator={item?.in?.id?.String}
                title={item?.data?.package_name}
                content={item?.data?.pkg_details}
                imgs={item?.data?.package_pic}
                onPressOption={openPostModal}
              />
            );
          }}
          // if (item.id.tb === "post") {
          //   return (
          //     <Post
          //       creator={item.in.id.String}
          //       title={item.out.tb}
          //       content={item.data.pkg_details}
          //       imgs={item.data.package_pic}
          //       onPressOption={openPostModal}
          //     />
          //   );
          // } else {
          //   return <DriverLists drivers={item.users} />;
          // }
          keyExtractor={(item) => item.id.id.String}
        />
      </View>
      <PostModal
        visible={postModalInfo.modalVisible}
        closeModal={closePostModal}
      />
    </>
  );
};

export default NewFeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});
