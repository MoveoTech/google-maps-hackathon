import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Button, Text, View } from "react-native";
import HomePage from "./features/pages/HomePage/HomePage";
import { AppContainer } from "./features/globalStyle";
import { UserProvider } from "./features/contexts/UserContext";
import { useAuthentication } from "./features/hooks/useAuthentication";
import { useLocationPermissionStatus } from "./features/hooks/useLocationPermissionStatus";
import { addUser } from "./features/api/api";
import { IUser } from "./features/types";

export default function App() {
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

  return (
    <UserProvider>
      <AppContainer>
        {locationStatus === "granted" ? (
          <View style={styles.container}>
            {user ? (
              <>
                {showUserInfo()}
                <HomePage />
              </>
            ) : (
              <Button
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
