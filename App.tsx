import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import {
  gestureHandlerRootHOC,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

// Fonts
import AvenirRegular from "./assets/fonts/Avenir-Regular.ttf";
import AvenirLight from "./assets/fonts/Avenir-Light.ttf";
import AvenirHeavy from "./assets/fonts/Avenir-Heavy.ttf";
import AvenirBook from "./assets/fonts/Avenir-Book.ttf";
import Location from "./src/features/pages/Location/Location";
import Auth from "./src/features/pages/Auth/Auth";
import CircularLoader from "./src/features/components/CircularLoader/CircularLoader";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [loaded] = useFonts({
    "Avenir-regular": AvenirRegular,
    "Avenir-light": AvenirLight,
    "Avenir-heavy": AvenirHeavy,
    "Avenir-book": AvenirBook,
  });

  if (!loaded) return <CircularLoader />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={() => ({
            title: "",
          })}
        >
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Location"
            component={gestureHandlerRootHOC(Location)}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
