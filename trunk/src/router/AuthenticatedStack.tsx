import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import NewFeedScreen from "../screens/NewFeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PostCreateScreen from "../screens/PostCreateScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import NotificationScreen from "../screens/NotificationScreen";

import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

//styles
import { GlobalStyles } from "../constants/styles";
import React, { useState } from "react";
import SelfStatusScreen from "../screens/SelfStatusScreen";
import StatusDetail from "../screens/StatusDetail";
import MapScreen from "../screens/MapScreen";
import CarStatusScreen from "../screens/CarStatusScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const [activeNoti, setActiveNoti] = useState<boolean>(true);
  return (
    <Tab.Navigator
      initialRouteName="NewFeed"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // let iconName: any;
          let icon: React.JSX.Element;

          if (route.name === "NewFeed") {
            // iconName = focused
            //     ? 'ios-information-circle'
            //     : 'ios-information-circle-outline';
            icon = <Entypo name="home" size={size} color={color} />;
          } else if (route.name === "Notification") {
            icon = activeNoti ? (
              <View style={styles.activeContainer}>
                <View style={styles.active}></View>
                <Ionicons name="notifications" size={size} color={color} />
              </View>
            ) : (
              <Ionicons name="notifications" size={size} color={color} />
            );
          } else if (route.name === "Profile") {
            icon = <Entypo name="user" size={size} color={color} />;
          } else if (route.name === "PostCreate") {
            icon = <AntDesign name="plus" size={size} color={color} />;
          } else if (route.name === "SelfStatus") {
            icon = <Entypo name="list" size={size} color={color} />;
          }

          // You can return any component that you like here!
          return icon;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: GlobalStyles.colors.primaryColor,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="NewFeed" component={NewFeedScreen} />
      <Tab.Screen
        name="PostCreate"
        component={PostCreateScreen}
        options={{
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="SelfStatus" component={SelfStatusScreen} />
    </Tab.Navigator>
  );
};

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="StatusDetail" component={StatusDetail} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="CarStatus" component={CarStatusScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  activeContainer: {
    position: "relative",
  },
  active: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: GlobalStyles.colors.activeGreen,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
  },
});

export default AuthenticatedStack;
