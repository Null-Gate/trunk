import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import AuthenticatedStack from "./AuthenticatedStack";

const Navigation = () => {
    return (
        <SafeAreaProvider>
            <StatusBar />
            <NavigationContainer>
                {/* <AuthStack /> */}
                <AuthenticatedStack />
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

export default Navigation;