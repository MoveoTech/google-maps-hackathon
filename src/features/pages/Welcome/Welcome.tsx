import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";

import backgroundImage from "../../../../assets/welcome.png";

import Button from "../../components/Button/Button";
import Typography from "../../components/Typography/Typography";
import logo from "../../../../assets/pin.png";

const Welcome = ({ navigation }) => {
  const handleOnPress = () => {
    navigation.navigate("Auth");
  };
  return (
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
          buttonType="primary"
          style={styles.button}
          title="Start your tour now!"
          onPress={handleOnPress}
        />
        <Typography>Hey guys, sorry for the design. Stav is busy :)</Typography>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  button: {
    marginHorizontal: 8,
    marginBottom: 16,
    width: Dimensions.get("window").width - 16,
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
  logo: {
    position: "absolute",
    zIndex: 1,
    top: 52,
  },
});
