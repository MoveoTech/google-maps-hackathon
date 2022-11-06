import React, {useEffect, useState} from "react";
import Map from "../../components/Map/Map";
import {HomepageContainer} from "./styles";
import {getNearByPlaces, IPlace} from "../../../api/googleApi";
import {Cards} from "../../components/Card/Cards";
import {DraggableDrawer} from "../../components/DraggableDrawer";
import {LocationObject} from "expo-location";
import {LatLng} from "react-native-maps";
import {MapDirectionsResponse} from "react-native-maps-directions";
import {MarkerTypes} from "../../components/Map/components/CustomMarker";
import {DirectionsType} from "../../components/Map/components/Directions";
import {GoogleMapsPlaces} from "../../types";
// import { Button } from "react-native";
import {PhotosBaseURL} from "../../components/Card/InfoCard";
import {GOOGLE_MAPS_APIKEY} from "@env";
import Snackbar from "../../components/Snackbar/Snackbar";
import TimelineComponent from "../../components/TimelineComponent/TimelineComponent";
import Button from "../../components/Button/Button";
import RefreshIcon from "../../../../assets/refresh.png";
import {useSnackbar} from "../../hooks/useSnackbar";
import {StickyFooter} from "../../components/Card/StickyFooter";
import {Dimensions, View} from "react-native";

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

const SEARCH_RADIUS = 3000;

interface Props {
    location: LocationObject;
}

export const HomePageMap = ({location}: Props) => {
    const [topFourPlaces, setTopFourPlaces] = useState<IPlaceOnMap[]>(null);
    const [allPlaces, setAllPlaces] = useState<IPlace[]>([]);
    const [allPlacesIndex, setAllPlacesIndex] = useState(0);
    const [activeStep, setActiveStep] = useState(1);
    const [topTitle, setTopTitle] = useState("Choose an amazing breakfast");
    const {openSnackbar, hideSnackbar, snackbar} = useSnackbar();
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
        openSnackbar({title: `You've added it to your trip`, isCheckIcon: true});
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
                    location={location}
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
                next={onNextStep}
            >
                <Cards topFourPlaces={topFourPlaces} onCardSelect={onSelectPlace}/>
                <Button
                    title="Please offer me something else"
                    onPress={replaceTopFour}
                    icon={RefreshIcon}
                    buttonType="secondary"
                    style={{width: "80%", margin: 8, marginBottom: 150, marginTop: 20}}
                />
            </DraggableDrawer>
            <View style={{width: Dimensions.get("window").width, height: 50}}>
                <StickyFooter next={onNextStep}/>
            </View>
            <Snackbar
                label={snackbar.title}
                isCheckIcon={snackbar.isCheckIcon}
                visible={snackbar.isVisible}
                hide={hideSnackbar}
            />
        </>
    );
};
