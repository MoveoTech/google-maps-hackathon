import React, { useEffect, useState } from "react";
import Map from "../../components/Map/Map";
import { HomepageContainer } from "./styles";
import { getNearByPlaces, IPlace } from "../../../api/googleApi";
import { Cards } from "../../components/Card/Cards";
import { DraggableDrawer } from "../../components/DraggableDrawer";
import TimelineComponent from "../../components/TimelineComponent/TimelineComponent";
import { LocationObject } from "expo-location";
import { LatLng } from "react-native-maps";
import { MapDirectionsResponse } from "react-native-maps-directions";
import { MarkerTypes } from "../../components/Map/components/CustomMarker";
import { DirectionsType } from "../../components/Map/components/Directions";
import { GoogleMapsPlaces } from "../../types";
import { Button } from "react-native";

export interface IPlaceOnMap extends IPlace {
  marker: IMarker;
  direction: IDirections;
  isSelected: boolean;
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

interface Props {
  location: LocationObject;
}
export const HomePageMap = ({ location }: Props) => {
  const [topFourPlaces, setTopFourPlaces] = useState<IPlaceOnMap[]>(null);
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
        place.direction.type = "dashed";
      } else {
        place.isSelected = false;
        place.direction.type = "transparent";
      }
    });
    setTopFourPlaces([...topFourPlaces]);
  };

  const onNextStep = () => {
    const selectedPlace = topFourPlaces.find((place) => place.isSelected);
    setTripPlaces((prev) => [...(prev || []), selectedPlace]);
    const newStartingLocation: LatLng = {
      latitude: selectedPlace.geometry.location.lat,
      longitude: selectedPlace.geometry.location.lng,
    };
    setStartingLocation(newStartingLocation);
    const newLocationType: GoogleMapsPlaces = "cafe";
    setLocationType(newLocationType);
    //TODO: trigger indication Toast for user
    setAllPlacesIndex(0);
    calculateStep(newStartingLocation, newLocationType);
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

  const calculateStep = async (
    newStartingLocation?: LatLng,
    newLocationType?: GoogleMapsPlaces
  ) => {
    try {
      const nearbyPlacesResponse = await getNearByPlaces(
        newStartingLocation || startingLocation,
        SEARCH_RADIUS,
        newLocationType || locationType
      );
      setAllPlaces(nearbyPlacesResponse.data.results);
      createTopPlaces(nearbyPlacesResponse.data.results.slice(0, 4));
    } catch (e) {
      console.log(e);
    }
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
    <>
      <HomepageContainer>
        <Map
          location={location}
          topFourPlaces={topFourPlaces}
          onDirectionsReady={onDirectionsReady}
        />
      </HomepageContainer>
      <DraggableDrawer>
        <Cards topFourPlaces={topFourPlaces} onCardSelect={onSelectPlace} />
        <Button title="replace places" onPress={replaceTopFour} />
        <Button
          disabled={
            !Boolean(topFourPlaces?.find((place) => place.isSelected === true))
          }
          title="next"
          onPress={onNextStep}
        />
        <TimelineComponent />
      </DraggableDrawer>
    </>
  );
};
