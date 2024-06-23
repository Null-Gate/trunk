import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
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
import NewFeedScreen from './src/screens/NewFeedScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';

// icons
import { Foundation } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

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
						icon = <TabBarIcon title='NewFeed' color={color} icon={<Foundation name="home" size={size} color={color} />} />
					} else if (route.name === "Notification") {
						icon = <TabBarIcon title='Notification' color={color} icon={<Ionicons name="notifications" size={size} color={color} />} />
					} else if (route.name === "Menu") {
						icon = <TabBarIcon title='Menu' color={color} icon={<SimpleLineIcons name="menu" size={20} color={color} />} />
					}
					return icon;
				},
				tabBarActiveTintColor: GlobalStyles.colors.primaryColor,
				tabBarInactiveTintColor: "gray",
				tabBarStyle: {
					backgroundColor: "#ededed",
					height: 60
				},
				tabBarShowLabel: false
			})}
		>
			<Tab.Screen name='NewFeed' component={NewFeedScreen} />
			<Tab.Screen name='Notification' component={NotificationScreen} />
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
					backgroundColor='transparent'
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
					initialRouteName='BottomTab'
					screenOptions={{
						headerShown: false
					}}
				>
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
