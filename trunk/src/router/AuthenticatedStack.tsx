import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import NewFeedScreen from "../screens/NewFeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PostCreateScreen from "../screens/PostCreateScreen";
import PostDetailScreen from "../screens/PostDetailScreen";

import { Entypo } from '@expo/vector-icons';

//styles
import { GlobalStyles } from "../constants/styles";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;

                    if (route.name === 'NewFeed') {
                        // iconName = focused
                        //     ? 'ios-information-circle'
                        //     : 'ios-information-circle-outline';
                        iconName = "home";
                    } else if (route.name === 'PostCreate') {
                        iconName = "plus";
                    } else if (route.name === 'Profile') {
                        iconName = "user";
                    }

                    // You can return any component that you like here!
                    return <Entypo name={iconName} size={size} color={color} />;
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: GlobalStyles.colors.primaryColor,
                tabBarInactiveTintColor: 'gray',
                headerStyle: {
                    backgroundColor: GlobalStyles.colors.primaryColor
                }
            })}
        >
            <Tab.Screen
                name="NewFeed"
                component={NewFeedScreen}
            />
            <Tab.Screen
                name="PostCreate"
                component={PostCreateScreen}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
            />
        </Tab.Navigator>
    )
}

const AuthenticatedStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="BottomTab"
        >
            <Stack.Screen
                name="BottomTab"
                component={BottomTab}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="PostDetail"
                component={PostDetailScreen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default AuthenticatedStack;