import { LocationObject } from "expo-location/build/Location.types";
import React, { useState } from "react";
import { StyleSheet, Dimensions, Text } from "react-native";
import MapView from "react-native-maps";
import { MapDirectionsResponse } from "react-native-maps-directions";
import { useNearbyPlaces } from "../../hooks/useNearbyPlaces";
import { GoogleMapsPlaces } from "../../types";
import { Directions } from "./components/Directions";
import { CustomMarker } from "./components/CustomMarker";

interface Props {
  location: LocationObject;
}

const Map = ({ location }: Props) => {
  const [locationType, setLocationType] =
    useState<GoogleMapsPlaces>("restaurant");
  const [searchRadius, setSearchRadius] = useState<number>(50);

  const { places } = useNearbyPlaces(
    { lat: location?.coords?.latitude, lng: location?.coords?.longitude },
    { radius: searchRadius, type: locationType }
  );

  const [dis, setDis] = useState(0);
  const [duration, setDuration] = useState(0);

  const onDirectionsReady: (...args: MapDirectionsResponse[]) => void = (
    args
  ) => {
    setDis(args.distance);
    setDuration(args.duration);
  };

  return (
    <MapView
      initialRegion={{
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
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
      <CustomMarker
        coordinates={{
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude,
        }}
        type="circle"
        tooltip="title"
        bgImg="https://picsum.photos/200/"
      />

      <Directions
        type="dashedLight"
        origin={{
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude,
        }}
        destination={{
          latitude: 32.077637,
          longitude: 34.774517,
        }}
        onReady={onDirectionsReady}
      />
      <Text>
        {dis}/{duration}
      </Text>
      {places &&
        places.map((place) => <Text key={place.place_id}>{place.name}</Text>)}
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
