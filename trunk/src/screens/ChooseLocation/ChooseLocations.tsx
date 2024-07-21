import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Components
import ChooseOrigin from "./ChooseOrigin";
import ChooseDestination from "./ChooseDestination";

const ChooseLocations = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChooseOrigin" component={ChooseOrigin} />
      <Stack.Screen name="ChooseDestination" component={ChooseDestination} />
    </Stack.Navigator>
  );
};

export default ChooseLocations;

