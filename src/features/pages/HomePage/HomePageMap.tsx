import React, { useCallback, useEffect, useState } from "react";
import Map from "../../components/Map/Map";
import { HomepageContainer } from "./styles";
import {
  getDetails,
  getNearByPlaces,
  IPlace,
  PhotosBaseURL,
} from "../../../api/googleApi";
import { Cards } from "../../components/Card/Cards";
import { DraggableDrawer } from "../../components/DraggableDrawer";
import { LocationObject } from "expo-location";
import { LatLng } from "react-native-maps";
import { MapDirectionsResponse } from "react-native-maps-directions";
import { MarkerTypes } from "../../components/Map/components/CustomMarker";
import { DirectionsType } from "../../components/Map/components/Directions";
import { GoogleMapsPlaces } from "../../types";
import { GOOGLE_MAPS_APIKEY } from "@env";
import Snackbar from "../../components/Snackbar/Snackbar";
import TimelineComponent from "../../components/TimelineComponent/TimelineComponent";
import RefreshIcon from "../../../../assets/refresh.png";
import { useSnackbar } from "../../hooks/useSnackbar";
import { Dimensions, View } from "react-native";
import { StickyFooter } from "../../components/Card/StickyFooter";
import { Button } from "react-native-paper";
import { TripLocation } from "../../components/Card/TripLocation";
import { cleanText } from "../../utils";
import { InfoCardSkeleton } from "../../components/Card/InfoCardSkeleton";
import _ from "lodash";

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

const placesIcon = {
  restaurant: require(`../../../../assets/restaurant.png`),
  cafe: require(`../../../../assets/cafe.png`),
  bar: require(`../../../../assets/bar.png`),
  tourist_attraction: require(`../../../../assets/tourist_attraction.png`),
  park: require(`../../../../assets/park.png`),
  beach: require(`../../../../assets/beach.png`),
};

const SEARCH_RADIUS = 500;

interface Props {
  location: Pick<LocationObject, "coords">;
}

export interface IStartLocation {
  id: string;
  name: string;
}
export const HomePageMap = ({ location }: Props) => {
  const [topFourPlaces, setTopFourPlaces] = useState<IPlaceOnMap[]>([]);
  const [allPlaces, setAllPlaces] = useState<IPlace[]>([]);
  const [allPlacesIndex, setAllPlacesIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onBoarding, setOnBoarding] = useState(true);
  const [topTitle, setTopTitle] = useState("Choose an amazing breakfast");
  const [tripPlaces, setTripPlaces] = useState<IPlaceOnMap[]>([]);
  const { openSnackbar, hideSnackbar, snackbar } = useSnackbar();
  const [showTimeline, setShowTimeline] = useState(false);
  const [startingLocationAddress, setStartingLocationAddress] =
    useState<IStartLocation>();
  const [startingLocation, setStartingLocation] = useState<LatLng>({
    latitude: location?.coords?.latitude,
    longitude: location?.coords?.longitude,
  });

  const [locationType, setLocationType] = useState<GoogleMapsPlaces>("cafe");
  const [region, setRegion] = useState<LatLng>({
    latitude: location?.coords?.latitude,
    longitude: location?.coords?.longitude,
  });

  const [snapIndex, setSnapIndex] = useState<0 | 1 | 2>(1);

  const handleSheetChanges = useCallback((index: 0 | 1 | 2) => {
    setSnapIndex(index);
  }, []);

  const onPredictionClicked = useCallback(async (place_id: string) => {
    const details = await getDetails(place_id);
    if (details) {
      const latitude = details?.data.result.geometry.location.lat;
      const longitude = details?.data.result.geometry.location.lng;
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude,
        longitude,
      }));
      setStartingLocation({
        latitude,
        longitude,
      });
      const startingLocation = {
        name: details?.data?.result?.formatted_address,
        id: details?.data?.result?.place_id,
      };
      setStartingLocationAddress(startingLocation);
    }
  }, []);

  const changeRegion = ({ lat, lng }: { lat: number; lng: number }) => {
    setRegion({
      latitude: lat,
      longitude: lng,
    });
  };
  const maxSteps = 4;

  const onSelectPlace = (place_id: string) => {
    let lat: number, lng: number;
    topFourPlaces.forEach((place) => {
      if (place.place_id === place_id) {
        place.isSelected = true;
        place.direction.type = "dashed";
        [lat, lng] = [place.geometry.location.lat, place.geometry.location.lng];
        const newRegion = {
          lat: (lat + region.latitude) / 2,
          lng: (lng + region.longitude) / 2,
        };
        newRegion.lat = newRegion.lat - 0.008;
        changeRegion(newRegion);
      } else {
        place.isSelected = false;
        place.direction.type = "transparent";
      }
    });
    setTopFourPlaces([...topFourPlaces]);
  };

  const getNewLocationType = (): GoogleMapsPlaces => {
    if (activeStep === 2) return "restaurant";

    const locationTypes: GoogleMapsPlaces[] = [
      "tourist_attraction",
      "bar",
      "park",
    ];
    return locationTypes[Math.round(Math.random() * 2)];
  };

  const addStep = () => {
    const selectedPlace = topFourPlaces.find((place) => place.isSelected);
    if (selectedPlace) {
      setTripPlaces((prev) => [...(prev || []), selectedPlace]);
      const newStartingLocation: LatLng = {
        latitude: selectedPlace.geometry.location.lat,
        longitude: selectedPlace.geometry.location.lng,
      };
      setStartingLocation(newStartingLocation);
      return newStartingLocation;
    }
  };
  const createNextPlace = (
    isLastStep: boolean,
    newStartingLocation: LatLng = startingLocation
  ) => {
    const newLocationType = getNewLocationType();
    setLocationType(newLocationType);
    setAllPlacesIndex(0);
    setActiveStep((activeStep) => activeStep + 1);
    if (isLastStep) {
      setTopFourPlaces([]);
      setShowTimeline(true);
      setTopTitle("Trip summary");
      return;
    }
    calculateStep(newStartingLocation, newLocationType);
    setTopTitle(`Choose a ${cleanText(newLocationType)}`);
  };

  const onNextStep = (isLastStep: boolean) => {
    const newStartingLocation = addStep();
    createNextPlace(isLastStep, newStartingLocation);
    openSnackbar({
      title: `You've added it to your trip`,
      isCheckIcon: true,
    });
  };

  const replaceTopFour = () => {
    createTopPlaces();
  };

  const createMarker = (
    place: IPlaceOnMap,
    newLocationType?: GoogleMapsPlaces
  ): IMarker => {
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
      bgImg: `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`,
      bgIcon: placesIcon[newLocationType || locationType],
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

  const createTopPlaces = (
    places?: IPlace[],
    newStartingLocation?: LatLng,
    newLocationType?: GoogleMapsPlaces
  ) => {
    const topFourPlaces =
      places || allPlaces.slice(allPlacesIndex * 4, allPlacesIndex * 4 + 4);
    if (topFourPlaces.length === 0) {
      openSnackbar({
        title: `No more new ${cleanText(locationType)}'s left`,
        isCheckIcon: false,
      });
      return;
    }
    const location = newStartingLocation || startingLocation;
    (topFourPlaces as IPlaceOnMap[]).forEach((place) => {
      place.marker = createMarker(place, newLocationType);
      place.direction = createDirection(place, location);
      place.isSelected = false;
      place.locationType = newLocationType || locationType;
      place.timeAtPlace = 2;
    });
    setTopFourPlaces(topFourPlaces as IPlaceOnMap[]);
    setAllPlacesIndex((prev) => prev + 1);
  };

  const continueCallback = () => {
    setOnBoarding(false);
    calculateStep(region, locationType);
  };

  const calculateStep = async (
    newStartingLocation?: LatLng,
    newLocationType?: GoogleMapsPlaces
  ) => {
    const baseLocation = newStartingLocation || startingLocation;
    try {
      setIsLoading(true);
      const nearbyPlacesResponse = await getNearByPlaces(
        baseLocation,
        SEARCH_RADIUS,
        newLocationType || locationType
      );
      setIsLoading(false);
      const filteredResults = nearbyPlacesResponse.data.results?.filter(
        (place) => {
          const isPlaceAlreadyInTrip = tripPlaces
            .map((place) => place.place_id)
            .includes(place.place_id);
          return !isPlaceAlreadyInTrip;
        }
      );
      setAllPlaces(filteredResults);
      createTopPlaces(
        filteredResults.slice(0, 4),
        baseLocation,
        newLocationType
      );
    } catch (e) {
      console.log(e);
    } finally {
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
    setTopFourPlaces([...topFourPlaces]);
  };

  const initialWizard = () => {
    setTopFourPlaces([]);
    setAllPlaces([]);
    setAllPlacesIndex(0);
    setActiveStep(0);
    setTopTitle("Choose an amazing breakfast");
    setTripPlaces([]);
    setShowTimeline(false);
    calculateStep();
  };

  return (
    <>
      <HomepageContainer>
        <Map
          location={region}
          topFourPlaces={onBoarding ? [] : topFourPlaces}
          tripPlaces={onBoarding ? [] : tripPlaces}
          onDirectionsReady={onBoarding ? () => {} : onDirectionsReady}
        />
      </HomepageContainer>
      <DraggableDrawer
        handleSheetChanges={handleSheetChanges as (index: number) => void}
        snapIndex={snapIndex}
        onBoarding={onBoarding}
        topTitle={topTitle}
        subTitle={
          activeStep > maxSteps
            ? "10:00 AM - 18:00 PM"
            : `Step ${activeStep.toString()} out of ${maxSteps.toString()}`
        }
      >
        {onBoarding && !showTimeline ? (
          <TripLocation
            handleSheetChanges={handleSheetChanges}
            onPredictionClicked={onPredictionClicked}
            currentLocationLat={location.coords.latitude}
            currentLocationLng={location.coords.longitude}
            setStartingLocationAddress={setStartingLocationAddress}
          />
        ) : isLoading ? (
          _.times(4).map((_, index) => <InfoCardSkeleton key={index} />)
        ) : (
          <Cards topFourPlaces={topFourPlaces} onCardSelect={onSelectPlace} />
        )}
        {showTimeline && (
          <TimelineComponent
            tripPlaces={tripPlaces}
            startingLocationAddress={startingLocationAddress}
            initialWizard={initialWizard}
          />
        )}
        {!onBoarding && !showTimeline && (
          <Button
            mode="outlined"
            onPress={replaceTopFour}
            icon={RefreshIcon}
            style={{
              margin: 8,
              marginBottom: "50%",
              marginTop: 20,
              borderRadius: 10,
            }}
            labelStyle={{ color: "black" }}
          >
            Please offer me something else
          </Button>
        )}
      </DraggableDrawer>
      <Snackbar
        label={snackbar.title}
        isCheckIcon={snackbar.isCheckIcon}
        visible={snackbar.isVisible}
        hide={hideSnackbar}
      />
      <View style={{ width: Dimensions.get("window").width, height: 100 }}>
        <StickyFooter
          tripPlaces={tripPlaces}
          showTimeline={showTimeline}
          startingLocation={startingLocationAddress}
          onBoarding={onBoarding}
          next={onNextStep}
          isNextDisabled={
            !Boolean(topFourPlaces?.find((place) => place.isSelected === true))
          }
          skip={createNextPlace}
          isLast={activeStep === maxSteps}
          continueCallback={continueCallback}
        />
      </View>
    </>
  );
};
