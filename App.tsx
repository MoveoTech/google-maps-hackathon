import React, { useEffect, useState } from "react";

import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "./src/features/pages/OnBoarding/OnBoarding";
import Welcome from "./src/features/components/Welcome/Welcome";
import { Image, StyleSheet, Button, Text, View } from "react-native";
//
import { useAuthentication } from "./src/features/hooks/useAuthentication";
import { useLocationPermissionStatus } from "./src/features/hooks/useLocationPermissionStatus";
import { addUser } from "./src/api/api";
import Loader from "./src/features/components/Loader/Loader";
import { IUser } from "./src/features/types";
export default function App() {
  const [user, setUser] = useState<IUser>();
  const { promptAsync, request, getUserData, accessToken, userInfo } =
    useAuthentication();
  const Stack = createNativeStackNavigator();
  const [loaded] = useFonts({
    "Avenir-regular": require("./assets/fonts/Avenir-Regular.ttf"),
    "Avenir-light": require("./assets/fonts/Avenir-Light.ttf"),
    "Avenir-heavy": require("./assets/fonts/Avenir-Heavy.ttf"),
    "Avenir-book": require("./assets/fonts/Avenir-Heavy.ttf"),
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
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
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
