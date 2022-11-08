import React from "react";
import { Image, View, Text, StyleSheet, ImageBackground } from "react-native";
import { LatLng, Marker } from "react-native-maps";

export type MarkerTypes = "dot" | "circle" | "pin";
interface MarkerProps {
  type: MarkerTypes;
  tooltip?: string;
  coordinates: LatLng;
  bgImg?: string;
  bgIcon?: number;
  isSelected: boolean;
  timeToPlace?: number;
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
  timeToPlace,
}: MarkerProps) => {
  return (
    <Marker coordinate={coordinates} zIndex={type === "pin" ? 1 : 0}>
      {tooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltip}</Text>
        </View>
      )}
      {isSelected && timeToPlace && (
        <View style={styles.timeToPlace}>
          <ImageBackground
            source={require("../../../../../assets/WalkWhite.png")}
            style={{
              width: 17,
              height: 17,
            }}
          />
          <Text style={styles.timeToPlaceText}>
            {Math.round(timeToPlace)} min
          </Text>
        </View>
      )}
      <View style={styles.MarkerContainer}>
        {(bgIcon || bgImg) && (
          <>
            {isSelected ? (
              <View
                style={{ ...styles.BgImageContainer, width: 65, height: 65 }}
              >
                <ImageBackground
                  source={{ uri: bgImg }}
                  style={{ ...styles.BgImage, width: 55, height: 55 }}
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    position: "relative",
    top: 10,
  },
  BgImage: {
    borderRadius: 6,
    overflow: "hidden",
  },
  timeToPlace: {
    backgroundColor: "#0AC2A1",
    borderRadius: 10,
    height: 30,
    width: 68,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: 6,
  },
  timeToPlaceText: {
    color: "#ffffff",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
  },
});
