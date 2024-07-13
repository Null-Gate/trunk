import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button } from 'react-native';
import { ReactNode } from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';

//expo-fonts
import { useFonts } from 'expo-font';

// react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// components
import TabBarIcon from './src/components/TabBarIcon';

// screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import NewFeedScreen from './src/screens/NewFeedScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import StatusScreen from './src/screens/StatusScreen';
import PasswordChangeScreen from './src/screens/PasswordChangeScreen';
import PasswordForgotScreen from './src/screens/PasswordForgotScreen';
import PostCreateScreen from './src/screens/PostCreateScreen';
import MapScreen from './src/screens/MapScreen';
import OnBoardingScreen from './src/screens/OnBoardingScreen';

// icons
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

// styles
import { GlobalStyles } from './src/constants/styles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTab = () => {
	return (
		<Tab.Navigator
			initialRouteName='NewFeed'
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let icon: ReactNode;
					if (route.name === "NewFeed") {
						icon = <TabBarIcon title='NewFeed' color={color} icon={<MaterialCommunityIcons name="newspaper-variant-multiple-outline" size={size} color={color} />} />
					} else if (route.name === "Notification") {
						icon = <TabBarIcon title='Notification' color={color} icon={<Ionicons name="notifications" size={size} color={color} />} />
					} else if (route.name === "Create") {
						icon = <TabBarIcon title='Create' color={color} icon={<Ionicons name="add" size={size} color={color} />} />
					} else if (route.name === "Status") {
						icon = <TabBarIcon title='Status' color={color} icon={<FontAwesome name="list-alt" size={size} color={color} />} />
					} else if (route.name === "Menu") {
						icon = <TabBarIcon title='Menu' color={color} icon={<SimpleLineIcons name="menu" size={size} color={color} />} />
					}
					return icon;
				},
				tabBarActiveTintColor: GlobalStyles.colors.primaryColor,
				tabBarInactiveTintColor: "gray",
				tabBarStyle: {
					backgroundColor: "#ededed",
					height: 60
				},
				tabBarShowLabel: false,
				headerTitleStyle: {
					fontFamily: "Poppins-Medium",
					fontSize: 18,
				}
			})}
		>
			<Tab.Screen name='NewFeed' component={NewFeedScreen} />
			<Tab.Screen name='Notification' component={NotificationScreen} />
			<Tab.Screen name='Create' component={PostCreateScreen} />
			<Tab.Screen name='Status' component={StatusScreen} />
			<Tab.Screen name='Menu' component={MenuScreen} />
		</Tab.Navigator>
	)
}

export default function App() {
	const [fontLoaded] = useFonts({
		'Poppins-Medium': require('./src/assets/fonts/Poppins/Poppins-Medium.ttf'),
		'Poppins-Thin': require('./src/assets/fonts/Poppins/Poppins-Light.ttf')
	});

	if (!fontLoaded) {
		return (
			<View style={{ flex: 1 }}>
				<StatusBar
					backgroundColor={"transparent"}
					translucent={true}
				/>
			</View>
		)
	}

	return (
		<SafeAreaProvider>
			<StatusBar />
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName='OnBoarding'
					screenOptions={({ navigation, route }) => ({
						headerShown: false,
						headerTitleStyle: {
							fontFamily: "Poppins-Medium",
							fontSize: 18,
						},
					})}
				>
					<Stack.Screen 
						name='OnBoarding'
						component={OnBoardingScreen}
						options={{
							headerShown: false
						}}
					/>
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{
							headerShown: false
						}}
					/>
					<Stack.Screen
						name="Signup"
						component={SignupScreen}
						options={{
							headerShown: false
						}}
					/>
					<Stack.Screen
						name="BottomTab"
						component={BottomTab}
					/>
					<Stack.Screen
						name='Profile'
						component={ProfileScreen}
						options={{
							headerShown: true,
							headerStyle: {
								backgroundColor: GlobalStyles.colors.primaryColor,
							},
							headerTitleStyle: {
								color: "#fff",
							}
						}}
					/>
					<Stack.Screen
						name='PostDetail'
						component={PostDetailScreen}
						options={{
							headerShown: true,
						}}
					/>
					<Stack.Screen
						name='PasswordChange'
						component={PasswordChangeScreen}
						options={{
							headerShown: true,
							headerTitle: "",
							headerStyle: {
								backgroundColor: "#ededed"
							}
						}}
					/>
					<Stack.Screen
						name='PasswordForgot'
						component={PasswordForgotScreen}
						options={{
							headerShown: true,
							headerTitle: "",
							headerStyle: {
								backgroundColor: GlobalStyles.colors.primaryColor
							}
						}}
					/>
					<Stack.Screen
						name='Map'
						component={MapScreen}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
