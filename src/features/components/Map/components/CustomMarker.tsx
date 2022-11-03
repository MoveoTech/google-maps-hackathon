import React from "react";
import { Image, View, Text, StyleSheet, ImageBackground } from "react-native";
import { Callout, LatLng, Marker } from "react-native-maps";

export type MarkerTypes = "dot" | "circle" | "pin";
interface MarkerProps {
  type: MarkerTypes;
  tooltip?: string;
  coordinates: LatLng;
  bgImg?: string;
}
type MarkersObj = {
  [key in MarkerTypes]?: number;
};
const MARKERS: MarkersObj = {
  dot: require("../../../../../assets/dot.png"),
  circle: require("../../../../../assets/circle.png"),
  pin: require("../../../../../assets/pin.png"),
};
export const CustomMarker = ({
  type,
  tooltip,
  coordinates,
  bgImg,
}: MarkerProps) => {
  return (
    <Marker coordinate={coordinates}>
      <View style={styles.MarkerContainer}>
        {bgImg && (
          <View style={styles.BgImageContainer}>
            <ImageBackground source={{ uri: bgImg }} style={styles.BgImage} />
          </View>
        )}
        <Image source={MARKERS[type]} />
      </View>
      {tooltip && (
        <Callout tooltip style={styles.Callout}>
          <Text>{tooltip}</Text>
        </Callout>
      )}
    </Marker>
  );
};

const styles = StyleSheet.create({
  Callout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    paddingHorizontal: 7,
    paddingVertical: 1,
    height: 18,
    borderRadius: 40,
  },
  MarkerContainer: {
    display: "flex",
    alignItems: "center",
  },
  BgImageContainer: {
    width: 55,
    height: 55,
    position: "relative",
    top: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  BgImage: {
    width: 45,
    height: 45,
    borderRadius: 6,
    overflow: "hidden",
  },
});
