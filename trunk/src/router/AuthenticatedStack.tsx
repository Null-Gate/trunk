import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import NewFeedScreen from "../screens/NewFeedScreen";
import PostDetailScreen from "../screens/PostDetailScreen";

const Stack = createNativeStackNavigator();

const AuthenticatedStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="NewFeed" 
                component={NewFeedScreen} 
            />
            <Stack.Screen 
                name="PostDetail" 
                component={PostDetailScreen} 
            />
        </Stack.Navigator>
    )
}

export default AuthenticatedStack;