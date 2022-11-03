import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Button as ReactButton,
  Text,
  View,
  Dimensions,
} from "react-native";

import HomePage from "./src/features/pages/HomePage/HomePage";
import { AppContainer } from "./src/features/globalStyle";
import { UserProvider } from "./src/features/contexts/UserContext";
import { useAuthentication } from "./src/features/hooks/useAuthentication";
import { useLocationPermissionStatus } from "./src/features/hooks/useLocationPermissionStatus";
import { addUser } from "./src/api/api";
import { IUser } from "./src/features/types";
import { useFonts } from "expo-font";

export default function App() {
  const [loaded] = useFonts({
    Avenir: require("./assets/fonts/Avenir-Heavy.ttf"),
  });
  const [user, setUser] = useState<IUser>();

  const { promptAsync, request, getUserData, accessToken, userInfo } =
    useAuthentication();

  const { locationStatus } = useLocationPermissionStatus();

  const showUserInfo = () => {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  };

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
    return null;
  }

  return (
    <UserProvider>
      <AppContainer>
        {locationStatus === "granted" ? (
          <View style={styles.container}>
            {user || true ? (
              <>
                {/* {showUserInfo()} */}
                <HomePage />
              </>
            ) : (
              <ReactButton
                title={"Login"}
                disabled={!request}
                onPress={() => promptAsync({ useProxy: true })}
              />
            )}
          </View>
        ) : (
          <Text>Allow location services to use app</Text>
        )}
        <StatusBar style="auto" />
      </AppContainer>
    </UserProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  userInfo: {
    marginTop: 200,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width * 0.95,
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});
