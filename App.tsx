import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  StyleSheet,
  Button,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import * as CurrentLocation from "expo-location";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import HomePage from "./features/pages/HomePage/HomePage";
import { requestLocationPermission } from "./features/permissions/requestLocationPermission";
import { AppContainer } from "./features/globalStyle";
import { UserProvider } from "./features/contexts/UserContext";

export default function App() {
  const [locationStatus, setLocationStatus] =
    useState<CurrentLocation.PermissionStatus>();

  const [accessToken, setAccessToken] = useState<string>();
  const [userInfo, setUserInfo] = useState<any>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "180552994170-lfo449ms3eo3onit71fn933br05thgi0.apps.googleusercontent.com",
    iosClientId:
      "180552994170-5uk5vtf4p30ini8527cfo3j9bmrl6nft.apps.googleusercontent.com",
    androidClientId:
      "180552994170-q7decoum332vr3u1kpprd57faktubiel.apps.googleusercontent.com",
  });

  const RequestLocation = async () => {
    const status = await requestLocationPermission();
    setLocationStatus(status);
  };
  const getUserData = async () => {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    userInfoResponse.json().then((data: any) => {
      setUserInfo(data);
    });
  };

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

  useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && getUserData();
    }
  }, [response, accessToken]);

  useEffect(() => {
    RequestLocation();
  }, []);

  WebBrowser.maybeCompleteAuthSession();

  return (
    <UserProvider>
      <AppContainer>
        {locationStatus === "granted" ? (
          <View style={styles.container}>
            {userInfo ? (
              <HomePage />
            ) : (
              <Button
                title={accessToken ? "Get User Data" : "Login"}
                disabled={!request}
                onPress={
                  accessToken
                    ? getUserData
                    : () => promptAsync({ useProxy: false })
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
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});
