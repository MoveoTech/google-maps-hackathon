import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

import { IUser } from "../../types";
import { addUser } from "../../../api/api";
import { useAuthentication } from "../../hooks/useAuthentication";
import { UserProvider } from "../../contexts/UserContext";
import AllowLocation from "../AllowLocation/AllowLocation";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";

import backgroundImage from "../../../../assets/welcome.png";
import logo from "../../../../assets/pin.png";

const Auth = ({ navigation }) => {
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

  //   const showUserInfo = () => {
  //     if (userInfo) {
  //       return (
  //         <View style={styles.userInfo}>
  //           <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
  //           <Text>Welcome {userInfo.name}</Text>
  //           <Text>{userInfo.email}</Text>
  //         </View>
  //       );
  //     }
  //   };
  if (isLoading)
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  return (
    <UserProvider>
      {user ? (
        <AllowLocation navigation={navigation} />
      ) : (
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <Image source={backgroundImage} />

          <Button
            style={styles.loginButton}
            title="Login with Google"
            disabled={!request}
            onPress={() => promptAsync({ useProxy: true })}
          />
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
});
