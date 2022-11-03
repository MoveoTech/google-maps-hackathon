import { LocationObject } from "expo-location/build/Location.types";
import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";
import { Directions } from "./components/Directions";
import { CustomMarker } from "./components/CustomMarker";
import { IPlaceOnMap } from "../../pages/HomePage/HomePageMap";
import { MapDirectionsResponse } from "react-native-maps-directions";

const { height, width } = Dimensions.get("window");
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

interface Props {
  location: LocationObject;
  topFourPlaces: IPlaceOnMap[];
  onDirectionsReady: (
    place_id: string,
    ...args: MapDirectionsResponse[]
  ) => void;
}

const Map = ({ location, topFourPlaces, onDirectionsReady }: Props) => {
  return (
    <MapView
      initialRegion={{
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      style={styles.map}
      provider="google"
      showsUserLocation
      showsCompass
      zoomEnabled
      zoomControlEnabled
      showsMyLocationButton
      followsUserLocation
      userLocationCalloutEnabled
    >
      <>
        {topFourPlaces?.map((place) => (
          <CustomMarker
            key={place.marker.id}
            coordinates={{
              latitude: place.marker.coordinates.latitude,
              longitude: place.marker.coordinates.longitude,
            }}
            type={place.marker.type}
            tooltip={place.marker.tooltip}
            bgImg={place.marker.bgImg}
            bgIcon={place.marker.bgIcon}
            isSelected={place.isSelected}
          />
        ))}

        {topFourPlaces?.map((place) => (
          <Directions
            key={place.direction.id}
            type={place.direction.type}
            origin={{
              latitude: place.direction.origin.latitude,
              longitude: place.direction.origin.longitude,
            }}
            destination={{
              latitude: place.direction.destination.latitude,
              longitude: place.direction.destination.longitude,
            }}
            onReady={(...args) => onDirectionsReady(place.place_id, ...args)}
          />
        ))}
      </>
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width * 0.95,
    height: Dimensions.get("window").height * 0.9,
  },
});
