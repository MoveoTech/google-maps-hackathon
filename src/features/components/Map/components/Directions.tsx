import React from "react";
import { GOOGLE_MAPS_APIKEY } from "@env";
import MapViewDirections, {
  MapViewDirectionsProps,
} from "react-native-maps-directions";

export type DirectionsType =
  | "primary"
  | "dashed"
  | "dashedLight"
  | "transparent";

interface DirectionTypes extends MapViewDirectionsProps {
  type?: DirectionsType;
}
type DirectionProps = Omit<
  DirectionTypes,
  "apikey" | "stokeWidth" | "strokeColor" | "lineDashPattern" | "mode"
>;

export const Directions = ({ type = "primary", ...props }: DirectionProps) => {
  return (
    <MapViewDirections
      mode="WALKING"
      apikey={GOOGLE_MAPS_APIKEY}
      strokeWidth={type === "dashedLight" ? 1 : 2}
      strokeColor={
        type === "transparent"
          ? "transparent"
          : type === "dashedLight"
          ? "rgba(10, 194, 160, 0.5)"
          : "#0ac2a0"
      }
      lineDashPattern={type === "primary" ? [] : [30, 30]}
      {...props}
    />
  );
};
