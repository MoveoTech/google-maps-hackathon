import React from "react";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Button, Text, View } from "react-native";
import HomePage from "./features/pages/HomePage/HomePage";
import { AppContainer } from "./features/globalStyle";
import { UserProvider } from "./features/contexts/UserContext";
import { useAuthentication } from "./features/hooks/useAuthentication";
import { useLocationPermissionStatus } from "./features/hooks/useLocationPermissionStatus";

export default function App() {
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

  return (
    <UserProvider>
      <AppContainer>
        {locationStatus === "granted" ? (
          <View style={styles.container}>
            {userInfo ? (
              <>
                {showUserInfo()}
                <HomePage />
              </>
            ) : (
              <Button
                title={accessToken ? "Get User Data" : "Login"}
                disabled={!request}
                onPress={
                  accessToken
                    ? getUserData
                    : () => promptAsync({ useProxy: true })
                }
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
