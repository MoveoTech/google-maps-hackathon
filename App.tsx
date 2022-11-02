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

import HomePage from "./src/features/pages/HomePage/HomePage";
import { AppContainer } from "./src/features/globalStyle";
import { UserProvider } from "./src/features/contexts/UserContext";
import { useAuthentication } from "./src/features/hooks/useAuthentication";
import { useLocationPermissionStatus } from "./src/features/hooks/useLocationPermissionStatus";
import { addUser } from "./src/api/api";
import { IUser } from "./src/features/types";
import { DraggableDrawer } from "./src/features/components/DraggableDrawer";
import TimelineComponent from "./src/features/components/TimelineComponent/TimelineComponent";

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
          </View>
        ) : (
          <Text>Allow location services to use app</Text>
        )}
        <DraggableDrawer>
          {/* <View>
            <Text>TESTING</Text>
          </View> */}
          <TimelineComponent />
        </DraggableDrawer>
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
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});
