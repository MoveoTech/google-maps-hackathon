import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

import { IUser } from "../../types";
import { addUser } from "../../../api/api";
import { useAuthentication } from "../../hooks/useAuthentication";
import { UserProvider } from "../../contexts/UserContext";
import AllowLocation from "../AllowLocation/AllowLocation";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import Location from "../Location/Location";
import backgroundImage from "../../../../assets/welcome.png";
import logo from "../../../../assets/pin.png";
import { requestLocationPermission } from "../../../permissions/requestLocationPermission";
import Typography from "../../components/Typography/Typography";

const Auth = ({ navigation }) => {
  const { status } = requestLocationPermission();

  const [user, setUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState(false);

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
      {user ? (
        status.granted ? (
          <Location />
        ) : (
          <AllowLocation
            navigation={navigation}
            currentLocationPermission={status}
          />
        )
      ) : (
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <Image source={backgroundImage} />
          <View style={styles.labelWrapper}>
            <Typography fontSize="xl" weight="900">
              Welcome to
            </Typography>
            <Typography fontSize="l" weight="500">
              Every day is a new adventure
            </Typography>
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              style={styles.loginButton}
              title="Login with Google"
              disabled={!request}
              onPress={() => promptAsync({ useProxy: true })}
            />
          </View>
        </View>
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
  logo: {
    position: "absolute",
    zIndex: 1,
    top: 52,
  },
  loginButton: {
    width: Dimensions.get("window").width - 16,
    marginBottom: 100,
  },
  buttonWrapper: {
    marginTop: 130,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 72,
  },
});
