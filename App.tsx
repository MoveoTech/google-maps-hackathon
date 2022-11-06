import React from "react";
import { StyleSheet } from "react-native";

import { useFonts } from "expo-font";
import Loader from "./src/features/components/Loader/Loader";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "./src/features/pages/OnBoarding/OnBoarding";
import Welcome from "./src/features/components/Welcome/Welcome";

export default function App() {
  const [loaded] = useFonts({
    Avenir: require("./assets/fonts/Avenir-Heavy.ttf"),
  });
  const Stack = createNativeStackNavigator();

  if (!loaded) {
    return <Loader />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => ({
          title: "",
        })}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {},
});
