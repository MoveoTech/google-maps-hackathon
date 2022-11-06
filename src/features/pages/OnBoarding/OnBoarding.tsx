import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Button,
  Text,
  View,
  Dimensions,
} from "react-native";
import { addUser } from "../../../api/api";
import { UserProvider } from "../../contexts/UserContext";
import { AppContainer } from "../../globalStyle";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useLocationPermissionStatus } from "../../hooks/useLocationPermissionStatus";
import { IUser } from "../../types";
import HomePage from "../HomePage/HomePage";

export default function OnBoarding() {
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
          <>
            {user || true ? (
              <>
                {/* {showUserInfo()} */}
                <HomePage />
              </>
            ) : (
              <Button
                title="Login"
                disabled={!request}
                onPress={() => promptAsync({ useProxy: true })}
              />
            )}
          </>
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
