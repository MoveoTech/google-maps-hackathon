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
import { PhotosBaseURL } from "../../components/Card/InfoCard";
import { GOOGLE_MAPS_APIKEY } from "@env";
import Snackbar from "../../components/Snackbar/Snackbar";

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
  bgIcon?: number;
}

export interface IDirections {
  id: string;
  origin: LatLng;
  destination: LatLng;
  type: DirectionsType;
  distance?: number;
  duration?: number;
}

const placesIcon = {
  restaurant: require(`../../../../assets/restaurant.png`),
};

const SEARCH_RADIUS = 100;

interface Props {
  location: LocationObject;
}

export const HomePageMap = ({ location }: Props) => {
  const [topFourPlaces, setTopFourPlaces] = useState<IPlaceOnMap[]>(null);
  const [allPlaces, setAllPlaces] = useState<IPlace[]>([]);
  const [allPlacesIndex, setAllPlacesIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [topTitle, setTopTitle] = useState("Choose an amazing breakfast");
  const maxSteps = 4;
  const title = [
    "Choose an amazing breakfast",
    "Choose and activity",
    "Choose another one",
    "Choose another one",
  ];

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

  const changeTitle = (activeStep) => {
    switch (activeStep) {
      case 1:
        setTopTitle(title[0]);
      case 2:
        setTopTitle(title[1]);
      case 3:
        setTopTitle(title[2]);
      case 4:
        setTopTitle(title[3]);
    }
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
    setActiveStep((activeStep) => activeStep + 1);
    calculateStep(newStartingLocation, newLocationType);
    changeTitle(activeStep);
  };

  const replaceTopFour = () => {
    createTopPlaces();
  };

  const createMarker = (place: IPlaceOnMap): IMarker => {
    const photoReference =
      (place?.photos as any[])?.length > 0
        ? place?.photos[0]?.photo_reference
        : null;
    return {
      id: place.place_id,
      coordinates: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      },
      type: "dot",
      tooltip: "dot",
      bgImg: `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`,
      bgIcon: placesIcon[locationType],
    };
  };
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
        <Snackbar label="bla bla" visible />
      </HomepageContainer>
      <DraggableDrawer
        activeStep={activeStep}
        maxSteps={maxSteps}
        setActiveStep={setActiveStep}
        topTitle={topTitle}
      >
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
