import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import Loader from "./src/features/components/Loader/Loader";

// Fonts
import AvenirRegular from "./assets/fonts/Avenir-Regular.ttf";
import AvenirLight from "./assets/fonts/Avenir-Light.ttf";
import AvenirHeavy from "./assets/fonts/Avenir-Heavy.ttf";
import AvenirBook from "./assets/fonts/Avenir-Book.ttf";
import Auth from "./src/features/pages/Auth/Auth";
import Location from "./src/features/pages/Location/Location";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [loaded] = useFonts({
    "Avenir-regular": AvenirRegular,
    "Avenir-light": AvenirLight,
    "Avenir-heavy": AvenirHeavy,
    "Avenir-book": AvenirBook,
  });

  if (!loaded) return <Loader />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => ({
          title: "",
        })}
      >
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Location" component={Location} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
