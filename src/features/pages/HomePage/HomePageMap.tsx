import React, { useEffect, useState } from "react";
import Map from "../../components/Map/Map";
import { HomepageContainer } from "./styles";
import { getNearByPlaces, IPlace } from "../../../api/googleApi";
import { Cards } from "../../components/Card/Cards";
import { DraggableDrawer } from "../../components/DraggableDrawer";
import { LocationObject } from "expo-location";
import { LatLng, Region } from "react-native-maps";
import { MapDirectionsResponse } from "react-native-maps-directions";
import { MarkerTypes } from "../../components/Map/components/CustomMarker";
import { DirectionsType } from "../../components/Map/components/Directions";
import { GoogleMapsPlaces } from "../../types";
import { PhotosBaseURL } from "../../components/Card/InfoCard";
import { GOOGLE_MAPS_APIKEY } from "@env";
import Snackbar from "../../components/Snackbar/Snackbar";
import TimelineComponent from "../../components/TimelineComponent/TimelineComponent";
import Button from "../../components/Button/Button";
import RefreshIcon from "../../../../assets/refresh.png";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Dimensions } from "react-native";

export interface IPlaceOnMap extends IPlace {
  marker: IMarker;
  direction: IDirections;
  isSelected: boolean;
  locationType: GoogleMapsPlaces;
  timeAtPlace: number;
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
const { height, width } = Dimensions.get("window");
const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const placesIcon = {
  restaurant: require(`../../../../assets/restaurant.png`),
};

const SEARCH_RADIUS = 3000;

interface Props {
  location: LocationObject;
}

export const HomePageMap = ({ location }: Props) => {
  const [topFourPlaces, setTopFourPlaces] = useState<IPlaceOnMap[]>(null);
  const [allPlaces, setAllPlaces] = useState<IPlace[]>([]);
  const [allPlacesIndex, setAllPlacesIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [topTitle, setTopTitle] = useState("Choose an amazing breakfast");
  const { openSnackbar, hideSnackbar, snackbar } = useSnackbar();
  const [showTimeline, setShowTimeline] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: location?.coords?.latitude,
    longitude: location?.coords?.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const changeRegion = ({ lat, lng }: { lat: number; lng: number }) => {
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };
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
    let lat, lng;
    topFourPlaces.forEach((place) => {
      if (place.place_id === place_id) {
        place.isSelected = true;
        place.direction.type = "dashed";
        [lat, lng] = [place.geometry.location.lat, place.geometry.location.lng];
      } else {
        place.isSelected = false;
        place.direction.type = "transparent";
      }
    });
    setTopFourPlaces([...topFourPlaces]);
    changeRegion({ lat: lat - 0.01, lng });
  };

  const onNextStep = (isLastStep: boolean) => {
    const selectedPlace = topFourPlaces.find((place) => place.isSelected);
    setTripPlaces((prev) => [...(prev || []), selectedPlace]);
    const newStartingLocation: LatLng = {
      latitude: selectedPlace.geometry.location.lat,
      longitude: selectedPlace.geometry.location.lng,
    };
    setStartingLocation(newStartingLocation);
    const newLocationType: GoogleMapsPlaces = "cafe";
    setLocationType(newLocationType);
    openSnackbar({ title: `You've added it to your trip`, isCheckIcon: true });
    setAllPlacesIndex(0);
    setActiveStep((activeStep) => activeStep + 1);
    if (isLastStep) {
      setTopFourPlaces([]);
      setShowTimeline(true);
      setTopTitle("Trip summary");
      return;
    }
    calculateStep(newStartingLocation, newLocationType);
    setTopTitle(title[activeStep - 1]);
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
      type: "pin",
      tooltip: "dot",
      bgImg: `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`,
      bgIcon: placesIcon[locationType],
    };
  };
  const createDirection = (
    place: IPlace,
    baseLocation: LatLng
  ): IDirections => ({
    id: place.place_id,
    origin: baseLocation,
    destination: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    type: "transparent",
  });

  const createTopPlaces = (places?: IPlace[], newStartingLocation?: LatLng) => {
    const topFourPlaces =
      places || allPlaces.slice(allPlacesIndex * 4, allPlacesIndex * 4 + 4);
    if (topFourPlaces.length === 0) {
      openSnackbar({
        title: `No more ${locationType}'s left`,
        isCheckIcon: false,
      });
      return;
    }
    const location = newStartingLocation || startingLocation;
    (topFourPlaces as IPlaceOnMap[]).forEach((place) => {
      place.marker = createMarker(place);
      place.direction = createDirection(place, location);
      place.isSelected = false;
      place.locationType = locationType;
      place.timeAtPlace = 2;
    });
    setTopFourPlaces(topFourPlaces as IPlaceOnMap[]);
    setAllPlacesIndex((prev) => prev + 1);
  };

  const calculateStep = async (
    newStartingLocation?: LatLng,
    newLocationType?: GoogleMapsPlaces
  ) => {
    const baseLocation = newStartingLocation || startingLocation;

    try {
      const nearbyPlacesResponse = await getNearByPlaces(
        baseLocation,
        SEARCH_RADIUS,
        newLocationType || locationType
      );
      setAllPlaces(nearbyPlacesResponse.data.results);
      createTopPlaces(
        nearbyPlacesResponse.data.results.slice(0, 4),
        baseLocation
      );
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
          location={region}
          topFourPlaces={topFourPlaces}
          tripPlaces={tripPlaces}
          onDirectionsReady={onDirectionsReady}
        />
      </HomepageContainer>
      <DraggableDrawer
        activeStep={activeStep}
        maxSteps={maxSteps}
        setActiveStep={setActiveStep}
        topTitle={topTitle}
        subTitle={
          activeStep > maxSteps
            ? "10:00 AM - 18:00 PM"
            : `Step ${activeStep.toString()} out of ${maxSteps.toString()}`
        }
      >
        <Cards topFourPlaces={topFourPlaces} onCardSelect={onSelectPlace} />
        {showTimeline ? (
          <TimelineComponent tripPlaces={tripPlaces} />
        ) : (
          <>
            <Button
              title="Please offer me something else"
              onPress={replaceTopFour}
              icon={RefreshIcon}
              buttonType="secondary"
              style={{ width: "80%", margin: 8 }}
            />
            <Button
              isDisabled={
                !Boolean(
                  topFourPlaces?.find((place) => place.isSelected === true)
                )
              }
              title={activeStep === maxSteps ? `Let's go!` : "next"}
              onPress={() => onNextStep(activeStep === maxSteps)}
            />
          </>
        )}
      </DraggableDrawer>
      <Snackbar
        label={snackbar.title}
        isCheckIcon={snackbar.isCheckIcon}
        visible={snackbar.isVisible}
        hide={hideSnackbar}
      />
    </>
  );
};
