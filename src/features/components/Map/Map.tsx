import { LocationObject } from "expo-location/build/Location.types";
import React, { Dispatch, useEffect, useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView, { LatLng } from "react-native-maps";
import { MapDirectionsResponse } from "react-native-maps-directions";
import { GoogleMapsPlaces } from "../../types";
import { Directions, DirectionsType } from "./components/Directions";
import { CustomMarker, MarkerTypes } from "./components/CustomMarker";
import { getNearByPlaces, IPlace } from "../../../api/googleApi";
import { IPlaceOnMap } from "../../pages/HomePage/HomePage";

interface Props {
  location: LocationObject;
  topFourPlaces: IPlaceOnMap[];
  setTopFourPlaces: Dispatch<React.SetStateAction<IPlaceOnMap[]>>;
}

export interface IMarker {
  id: string;
  coordinates: LatLng;
  type: MarkerTypes;
  tooltip?: string;
  bgImg?: string;
}
export interface IDirections {
  id: string;
  origin: LatLng;
  destination: LatLng;
  type: DirectionsType;
  distance?: number;
  duration?: number;
}

const SEARCH_RADIUS = 100;

const Map = ({ location, topFourPlaces, setTopFourPlaces }: Props) => {
  const [allPlaces, setAllPlaces] = useState<IPlace[]>([]);
  const [allPlacesIndex, setAllPlacesIndex] = useState(0);

  const [tripPlaces, setTripPlaces] = useState<IPlaceOnMap[]>(null);

  const [startingLocation, setStartingLocation] = useState<LatLng>({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });
  const [locationType, setLocationType] =
    useState<GoogleMapsPlaces>("restaurant");

  const onSelectPlace = (place_id: string) => {
    topFourPlaces.forEach((place) => {
      if (place.place_id === place_id) {
        place.isSelected = true;
        place.direction.type = "primary";
      } else {
        place.isSelected = false;
        place.direction.type = "transparent";
      }
    });
    setTopFourPlaces([...topFourPlaces]);
  };

  const onNextStep = () => {
    const selectedPlace = topFourPlaces.find((place) => place.isSelected);
    setTripPlaces((prev) => [...prev, selectedPlace]);
    setStartingLocation({
      latitude: selectedPlace.geometry.location.lat,
      longitude: selectedPlace.geometry.location.lng,
    });
    setLocationType("cafe");
    //TODO: trigger indication Toast for user
    //TODO: invoke calcNewStep()
  };

  const replaceTopFour = () => {
    createTopPlaces();
  };

  const createMarker = (place: IPlaceOnMap): IMarker => ({
    id: place.place_id,
    coordinates: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    type: "dot",
    tooltip: "dot",
    bgImg: "https://picsum.photos/200/",
  });

  const createDirection = (place: IPlace): IDirections => ({
    id: place.place_id,
    origin: startingLocation,
    destination: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    type: "transparent",
  });

  const createTopPlaces = (places?: IPlace[]) => {
    const topFourPlaces =
      places || allPlaces.slice(allPlacesIndex * 4, allPlacesIndex * 4 + 4);
    if (topFourPlaces.length === 0) {
      //TODO: alert user for zero palces left
      console.log("no more places");
      return;
    }
    (topFourPlaces as IPlaceOnMap[]).forEach((place) => {
      place.marker = createMarker(place);
      place.direction = createDirection(place);
      place.isSelected = false;
    });
    setTopFourPlaces(topFourPlaces as IPlaceOnMap[]);
    setAllPlacesIndex((prev) => prev + 1);
  };

  const calculateStep = async () => {
    try {
      const nearbyPlacesResponse = await getNearByPlaces(
        startingLocation,
        SEARCH_RADIUS,
        locationType
      );
      setAllPlaces(nearbyPlacesResponse.data.results);
      createTopPlaces(nearbyPlacesResponse.data.results.slice(0, 4));
    } catch (e) {}
  };

  useEffect(() => {
    calculateStep();
  }, []);

  const onDirectionsReady: (
    place_id: string,
    ...args: MapDirectionsResponse[]
  ) => void = (place_id, args) => {
    const placesIndex = topFourPlaces.findIndex(
      (place) => place.place_id === place_id
    );
    topFourPlaces[placesIndex].direction.distance = args.distance;
    topFourPlaces[placesIndex].direction.duration = args.duration;
    topFourPlaces[
      placesIndex
    ].marker.tooltip = `distance: ${args.distance} , duration: ${args.duration}`;

    setTopFourPlaces([...topFourPlaces]);
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
