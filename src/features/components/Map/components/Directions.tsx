import React from "react";
import { GOOGLE_MAPS_APIKEY } from "@env";
import MapViewDirections, {
  MapViewDirectionsProps,
} from "react-native-maps-directions";
import { MAIN } from "../../../globalStyle";

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
      strokeWidth={type === "dashedLight" ? 4 : 5}
      strokeColor={
        type === "transparent"
          ? "transparent"
          : type === "dashedLight"
          ? "#E56000"
          : MAIN
      }
      lineDashPattern={type === "primary" ? [] : [30, 30]}
      {...props}
    />
  );
};
