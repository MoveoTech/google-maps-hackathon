import React from "react";
import { Image, View, Text, StyleSheet, ImageBackground } from "react-native";
import { Callout, LatLng, Marker } from "react-native-maps";

export type MarkerTypes = "dot" | "circle" | "pin";
interface MarkerProps {
  type: MarkerTypes;
  tooltip?: string;
  coordinates: LatLng;
  bgImg?: string;
  bgIcon?: number;
  isSelected: boolean;
}
type MarkersObj = {
  [key in MarkerTypes]?: { path: number; style: {} };
};
const MARKERS: MarkersObj = {
  dot: { path: require("../../../../../assets/dot.png"), style: {} },
  circle: { path: require("../../../../../assets/circle.png"), style: {} },
  pin: {
    path: require("../../../../../assets/pin.png"),
    style: { width: 25, height: 30 },
  },
};
export const CustomMarker = ({
  type,
  tooltip,
  coordinates,
  bgImg,
  bgIcon,
  isSelected,
}: MarkerProps) => {
  return (
    <Marker coordinate={coordinates}>
      {tooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltip}</Text>
        </View>
      )}
      <View style={styles.MarkerContainer}>
        {(bgIcon || bgImg) && (
          <>
            {isSelected ? (
              <View
                style={{ ...styles.BgImageContainer, width: 55, height: 55 }}
              >
                <ImageBackground
                  source={{ uri: bgImg }}
                  style={{ ...styles.BgImage, width: 45, height: 45 }}
                />
              </View>
            ) : (
              <View
                style={{
                  ...styles.BgImageContainer,
                  width: 45,
                  height: 45,
                }}
              >
                <ImageBackground
                  source={bgIcon}
                  style={{
                    ...styles.BgImage,
                    width: 35,
                    height: 35,
                    backgroundColor: "#F3F3F3",
                  }}
                />
              </View>
            )}
          </>
        )}
        <Image source={MARKERS[type].path} style={MARKERS[type].style} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: "#fff",
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 40,
    height: 18,
    marginBottom: 3,
  },
  tooltipText: {
    color: "#222222",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
  },
  MarkerContainer: {
    display: "flex",
    alignItems: "center",
  },
  BgImageContainer: {
    position: "relative",
    top: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  BgImage: {
    borderRadius: 6,
    overflow: "hidden",
  },
});
