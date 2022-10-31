import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { Callout, LatLng, Marker } from "react-native-maps";

type Markers = "purpleCircle" | "purplePin" | "purpleWhiteCircle";
interface MarkerProps {
  type: Markers;
  tooltip?: string;
  coordinates: LatLng;
}
type MarkersObj = {
  [key in Markers]?: number;
};
const MARKERS: MarkersObj = {
  purpleCircle: require("../../../../../assets/purpleCircle.png"),
  purpleWhiteCircle: require("../../../../../assets/purpleWhiteCircle.png"),
  purplePin: require("../../../../../assets/purplePin.png"),
};
export const CustomMarker = ({ type, tooltip, coordinates }: MarkerProps) => {
  return (
    <Marker coordinate={coordinates}>
      <View>
        <Image source={MARKERS[type]} />
      </View>
      {tooltip && (
        <Callout style={styles.Callout}>
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
    width: 50,
    paddingHorizontal: 7,
    paddingVertical: 1,
    height: 18,
    borderRadius: 6,
  },
});
