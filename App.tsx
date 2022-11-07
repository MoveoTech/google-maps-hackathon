import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "./src/features/pages/OnBoarding/OnBoarding";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { useAuthentication } from "./src/features/hooks/useAuthentication";
import { useLocationPermissionStatus } from "./src/features/hooks/useLocationPermissionStatus";
import { addUser } from "./src/api/api";
import Loader from "./src/features/components/Loader/Loader";
import { IUser } from "./src/features/types";

// Fonts
import AvenirRegular from "./assets/fonts/Avenir-Regular.ttf";
import AvenirLight from "./assets/fonts/Avenir-Light.ttf";
import AvenirHeavy from "./assets/fonts/Avenir-Heavy.ttf";
import AvenirBook from "./assets/fonts/Avenir-Book.ttf";
import Auth from "./src/features/pages/Auth/Auth";
import Welcome from "./src/features/pages/Welcome/Welcome";
import HomePage from "./src/features/pages/Location/Location";
import { HomePageMap } from "./src/features/pages/HomePage/HomePageMap";
import Location from "./src/features/pages/Location/Location";

export default function App() {
  const [user, setUser] = useState<IUser>();
  const { promptAsync, request, getUserData, accessToken, userInfo } =
    useAuthentication();
  const Stack = createNativeStackNavigator();
  const [loaded] = useFonts({
    "Avenir-regular": AvenirRegular,
    "Avenir-light": AvenirLight,
    "Avenir-heavy": AvenirHeavy,
    "Avenir-book": AvenirBook,
  });

  // const { locationStatus } = useLocationPermissionStatus();

  // const showUserInfo = () => {
  //   if (userInfo) {
  //     return (
  //       <View style={styles.userInfo}>
  //         <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
  //         <Text>Welcome {userInfo.name}</Text>
  //         <Text>{userInfo.email}</Text>
  //       </View>
  //     );
  //   }
  // };

  const getOrAddUser = async () => {
    const currentUser = await addUser({
      username: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    });
    setUser(currentUser);
  };

  useEffect(() => {
    if (userInfo) getOrAddUser();
  }, [userInfo]);

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
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="Location" component={Location} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    marginTop: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});
