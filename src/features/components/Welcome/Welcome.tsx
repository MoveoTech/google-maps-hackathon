import React from "react";
import {
  View,
  Image,
  Button,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import backgroundImage from "../../../../assets/welcome.png";
import { MAIN } from "../../globalStyle";

const Welcome = ({ navigation }) => {
  const handleOnPress = () => {
    navigation.navigate("OnBoarding");
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={backgroundImage} />
        <Button title="Let's explore the area!" onPress={handleOnPress} />
        <Text>Hey guys, sorry for the design. Stav is busy :)</Text>
      </View>
    </GestureHandlerRootView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MAIN,
  },
  image: {
    borderRadius: 4,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
