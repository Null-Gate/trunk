import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button } from "react-native";
import { ReactNode } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

//expo-fonts
import { useFonts } from "expo-font";

// react navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// components
import TabBarIcon from "./src/components/TabBarIcon";

// screens
import LoginScreen from "./src/screens/LoginScreen";
import NewFeedScreen from "./src/screens/NewFeedScreen";
import MenuScreen from "./src/screens/MenuScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import PostDetailScreen from "./src/screens/PostDetailScreen";
import StatusScreen from "./src/screens/StatusScreen";
import PasswordChangeScreen from "./src/screens/PasswordChangeScreen";
import PostCreateScreen from "./src/screens/PostCreateScreen";

// icons
import { SimpleLineIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

// styles
import { GlobalStyles } from "./src/constants/styles";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="NewFeed"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon: ReactNode;
          if (route.name === "NewFeed") {
            icon = (
              <TabBarIcon
                title="NewFeed"
                color={color}
                icon={
                  <MaterialCommunityIcons
                    name="newspaper-variant-multiple-outline"
                    size={size}
                    color={color}
                  />
                }
              />
            );
          } else if (route.name === "Notification") {
            icon = (
              <TabBarIcon
                title="Notification"
                color={color}
                icon={
                  <Ionicons name="notifications" size={size} color={color} />
                }
              />
            );
          } else if (route.name === "Create") {
            icon = (
              <TabBarIcon
                title="Create"
                color={color}
                icon={<Ionicons name="add" size={size} color={color} />}
              />
            );
          } else if (route.name === "Status") {
            icon = (
              <TabBarIcon
                title="Status"
                color={color}
                icon={<FontAwesome name="list-alt" size={size} color={color} />}
              />
            );
          } else if (route.name === "Menu") {
            icon = (
              <TabBarIcon
                title="Menu"
                color={color}
                icon={<SimpleLineIcons name="menu" size={size} color={color} />}
              />
            );
          }
          return icon;
        },
        tabBarActiveTintColor: GlobalStyles.colors.primaryColor,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#ededed",
          height: 60,
        },
        tabBarShowLabel: false,
        headerTitleStyle: {
          fontFamily: "Poppins-Medium",
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen name="NewFeed" component={NewFeedScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Create" component={PostCreateScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [fontLoaded] = useFonts({
    "Poppins-Medium": require("./src/assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-Thin": require("./src/assets/fonts/Poppins/Poppins-Light.ttf"),
  });

  const queryClient = new QueryClient();

  if (!fontLoaded) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={"transparent"} translucent={true} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar />
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={({ navigation, route }) => ({
              headerShown: false,
              headerTitleStyle: {
                fontFamily: "Poppins-Medium",
                fontSize: 18,
              },
            })}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="BottomTab" component={BottomTab} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: GlobalStyles.colors.primaryColor,
                },
                headerTitleStyle: {
                  color: "#fff",
                },
              }}
            />
            <Stack.Screen
              name="PostDetail"
              component={PostDetailScreen}
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="PasswordChange"
              component={PasswordChangeScreen}
              options={{
                headerShown: true,
                headerTitle: "",
                headerStyle: {
                  backgroundColor: "#ededed",
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
