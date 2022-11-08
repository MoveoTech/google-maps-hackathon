import React, { memo } from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView, { Region } from "react-native-maps";
import { Directions } from "./components/Directions";
import { CustomMarker } from "./components/CustomMarker";
import { IPlaceOnMap } from "../../pages/HomePage/HomePageMap";
import { MapDirectionsResponse } from "react-native-maps-directions";

const { height, width } = Dimensions.get("window");

interface Props {
  location: Region;
  topFourPlaces: IPlaceOnMap[];
  tripPlaces: IPlaceOnMap[];
  onDirectionsReady: (
    place_id: string,
    ...args: MapDirectionsResponse[]
  ) => void;
}

const Map = ({
  location,
  topFourPlaces,
  tripPlaces,
  onDirectionsReady,
}: Props) => {
  return (
    <MapView
      region={location}
      style={styles.map}
      provider="google"
      showsUserLocation
      tintColor="#0AC2A1"
      zoomEnabled
      zoomControlEnabled
      showsMyLocationButton
      // followsUserLocation
      userLocationCalloutEnabled
    >
      <>
        {tripPlaces?.map((tripPlace, index) => (
          <CustomMarker
            key={index}
            coordinates={{
              latitude: tripPlace.marker.coordinates.latitude,
              longitude: tripPlace.marker.coordinates.longitude,
            }}
            type="dot"
            tooltip={`Stop ${index + 1}`}
            isSelected={false}
          />
        ))}
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
            timeToPlace={place.direction.duration}
          />
        ))}
        {tripPlaces?.map((tripPlace, index) => (
          <Directions
            key={index}
            type="dashedLight"
            origin={{
              latitude: tripPlace.direction.origin.latitude,
              longitude: tripPlace.direction.origin.longitude,
            }}
            destination={{
              latitude: tripPlace.direction.destination.latitude,
              longitude: tripPlace.direction.destination.longitude,
            }}
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

export default memo(Map);

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height * 0.9,
  },
});
