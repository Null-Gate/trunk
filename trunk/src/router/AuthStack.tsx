import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import RegisterLoginScreen from "../screens/RegisterLoginScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RegisterLogin"
                component={RegisterLoginScreen}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default AuthStack;