import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";

const Map = () => {
  return <MapView style={styles.map} />;
};

export default Map;

const styles = StyleSheet.create({
  map: {
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    width: "100%",
    height: "90%",
    padding: 0,
  },
});
