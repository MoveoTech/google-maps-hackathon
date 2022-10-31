import React from "react";
import { GOOGLE_MAPS_APIKEY } from "@env";
import MapViewDirections, {
  MapViewDirectionsProps,
} from "react-native-maps-directions";

interface Directions extends MapViewDirectionsProps {
  isDashed?: boolean;
}
type DirectionProps = Omit<
  Directions,
  "apikey" | "stokeWidth" | "strokeColor" | "lineDashPattern" | "mode"
>;

export const Directions = ({ isDashed = false, ...props }: DirectionProps) => {
  return (
    <MapViewDirections
      mode="WALKING"
      apikey={GOOGLE_MAPS_APIKEY}
      strokeWidth={2}
      strokeColor="#6938D3"
      lineDashPattern={isDashed ? [30, 30] : []}
      {...props}
    />
  );
};
