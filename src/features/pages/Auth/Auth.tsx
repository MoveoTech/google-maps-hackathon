import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from "react-native";

import { requestLocationPermission } from "../../../permissions/requestLocationPermission";
import { IUser } from "../../types";
import { addUser } from "../../../api/api";
import { useAuthentication } from "../../hooks/useAuthentication";
import { UserProvider } from "../../contexts/UserContext";
import AllowLocation from "../AllowLocation/AllowLocation";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import Location from "../Location/Location";
import Typography from "../../components/Typography/Typography";
import backgroundImage from "../../../../assets/welcome.png";
import { GRAY_LIGHT } from "../../globalStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { capitalize } from "lodash";

const Auth = ({ navigation }) => {
  const { status } = requestLocationPermission();

  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(false);
  const [skipLogin, setSkipLogin] = useState(false);

  const { promptAsync, request, getUserData, accessToken, userInfo } =
    useAuthentication();

  const getOrAddUser = async () => {
    try {
      setIsLoading(true);
      const currentUser = await addUser({
        username: userInfo?.name || "",
        email: userInfo?.email || "",
        picture: userInfo?.picture || "",
      });
      setUser(currentUser);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) getOrAddUser();
  }, [userInfo]);

  if (isLoading)
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  return (
    <UserProvider>
      {user || skipLogin ? (
        status?.granted ? (
          <Location />
        ) : (
          <AllowLocation
            username={capitalize(userInfo?.name || "") || ""}
            navigation={navigation}
            currentLocationPermission={status}
          />
        )
      ) : (
        <SafeAreaView style={styles.container}>
          <Image source={backgroundImage} style={{ height: "55%" }} />
          <View style={styles.labelWrapper}>
            <Typography fontSize="xxl" weight="900">
              Trip app
            </Typography>
            <Typography
              fontSize="l"
              weight="500"
              style={{ marginVertical: 12 }}
            >
              Every day is a new adventure
            </Typography>
            <Typography fontSize="l" color={GRAY_LIGHT}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Scelerisque ipsum mollis id tellus adipiscing faucibus luctus
              pellentesque faucibus.
            </Typography>
          </View>
          <Button
            style={styles.loginButton}
            title="Login and start you tour now!"
            disabled={!request}
            onPress={() => promptAsync()}
          />
          <Pressable onPress={() => setSkipLogin(true)}>
            <Text style={{ textDecorationLine: "underline" }}>
              Continue as a guest
            </Text>
          </Pressable>
        </SafeAreaView>
      )}
    </UserProvider>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  loginButton: {
    width: Dimensions.get("window").width - 16,
    marginBottom: 22,
  },

  labelWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
