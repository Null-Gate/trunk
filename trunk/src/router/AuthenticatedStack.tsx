import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React, { useState } from "react";

//screens
import NewFeedScreen from "../screens/NewFeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PostCreateScreen from "../screens/PostCreateScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import SelfStatusScreen from "../screens/SelfStatusScreen";
import StatusDetail from "../screens/StatusDetail";
import MapScreen from "../screens/MapScreen";
import CarStatusScreen from "../screens/CarStatusScreen";
import MenuScreen from "../screens/MenuScreen";
import PasswordChangeScreen from "../screens/PasswordChangeScreen";

import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';

//styles
import { GlobalStyles } from "../constants/styles";

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
					} else if (route.name === "PostCreate") {
						icon = <AntDesign name="plus" size={size} color={color} />;
					} else if (route.name === "SelfStatus") {
						icon = <Entypo name="list" size={size} color={color} />;
					} else if (route.name === "Menu") {
						icon = <Entypo name="menu" size={size} color={color} />
					}

					// You can return any component that you like here!
					return icon;
				},
				tabBarActiveTintColor: GlobalStyles.colors.primaryColor,
				tabBarInactiveTintColor: "gray",
				headerShown: false,
			})}
		>
			<Tab.Screen
				name="NewFeed"
				component={NewFeedScreen}
				options={{
					tabBarLabel: "NewFeed"
				}}
			/>
			<Tab.Screen
				name="Notification"
				component={NotificationScreen}
				options={{
					tabBarLabel: "Notification"
				}}
			/>
			<Tab.Screen
				name="PostCreate"
				component={PostCreateScreen}
				options={{
					tabBarLabel: "Create",
					tabBarStyle: {
						display: "none"
					},
				}}
			/>
			<Tab.Screen
				name="SelfStatus"
				component={SelfStatusScreen}
				options={{
					tabBarLabel: "Status"
				}}
			/>
			<Tab.Screen 
				name="Menu"
				component={MenuScreen}
				options={{
					tabBarLabel: "Menu"
				}}
			/>
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
			<Stack.Screen 
				name="BottomTab" 
				component={BottomTab} 
			/>
			<Stack.Screen
				name="PostDetail"
				component={PostDetailScreen}
				options={{
					headerShown: true,
					headerTitle: ""
				}}
			/>
			<Stack.Screen
				name="StatusDetail"
				component={StatusDetail}
			/>
			<Stack.Screen
				name="ProfileEdit"
				component={ProfileEditScreen}
			/>
			<Stack.Screen
				name="Map"
				component={MapScreen}
			/>
			<Stack.Screen
				name="CarStatus"
				component={CarStatusScreen}
			/>
			<Stack.Screen 
				name="Profile" 
				component={ProfileScreen} 
			/>
			<Stack.Screen 
				name="PasswordChange"
				component={PasswordChangeScreen}
				options={{ 
					headerShown: true,
					headerTitle: ""
				 }}
			/>
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
