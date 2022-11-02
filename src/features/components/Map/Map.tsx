import {LocationObject} from "expo-location/build/Location.types";
import React, {useEffect, useState} from "react";
import {StyleSheet, Dimensions} from "react-native";
import MapView, {LatLng} from "react-native-maps";
import {MapDirectionsResponse} from "react-native-maps-directions";
import {GoogleMapsPlaces} from "../../types";
import {Directions, DirectionsType} from "./components/Directions";
import {CustomMarker, MarkerTypes} from "./components/CustomMarker";
import {getNearByPlaces, IPlace} from "../../../api/googleApi";

interface Props {
    location: LocationObject;
}

interface IMarker {
    coordinates: LatLng;
    type: MarkerTypes;
    tooltip?: string;
    bgImg?: string;
}

interface IDirections {
    id: string;
    origin: LatLng;
    destination: LatLng;
    type: DirectionsType;
    distance?: number;
    duration?: number;
}

const SEARCH_RADIUS = 100;

const Map: React.FC<{ onLocationChanged: (iPlace: IPlace[]) => void, location: any }> = ({
                                                                                             location,
                                                                                             onLocationChanged
                                                                                         }) => {
    const [startingLocation, setStartingLocation] = useState<LatLng>({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    });
    const [locationType, setLocationType] =
        useState<GoogleMapsPlaces>("restaurant");
    const [optionalMarkers, setOptionalMarkers] = useState<IMarker[]>([]);
    const [optionalDirections, setOptionalDirections] = useState<IDirections[]>(
        []
    );

    const createMarkers = (places: IPlace[]): IMarker[] => {
        return places.map((place) => ({
            coordinates: {
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
            },
            type: "dot",
            tooltip: "dot",
            bgImg: "https://picsum.photos/200/",
        }));
    };

    const createDirections = (places: IPlace[]): IDirections[] => {
        return places.map((place) => ({
            id: place.place_id,
            origin: startingLocation,
            destination: {
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
            },
            type: "primary",
        }));
    };

    const calculateStep = async () => {
        try {
            const nearbyPlacesResponse = await getNearByPlaces(
                startingLocation,
                SEARCH_RADIUS,
                locationType
            );
            const topFourPlaces = nearbyPlacesResponse.data.results.slice(0, 4);
            onLocationChanged(topFourPlaces)
            const markers = createMarkers(topFourPlaces);
            setOptionalMarkers(markers);

            const directions = createDirections(topFourPlaces);
            setOptionalDirections(directions);
        } catch (e) {
        }
    };

    useEffect(() => {
        calculateStep();
    }, []);

    const onDirectionsReady: (
        direction_id: string,
        ...args: MapDirectionsResponse[]
    ) => void = (direction_id, args) => {
        const newDirections = [...optionalDirections];
        const directionIndex = newDirections.findIndex(
            (direction) => direction.id === direction_id
        );
        newDirections[directionIndex].distance = args.distance;
        newDirections[directionIndex].duration = args.duration;
        setOptionalDirections(newDirections);
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
                {optionalMarkers.map((marker, index) => (
                    <CustomMarker
                        key={index}
                        coordinates={{
                            latitude: marker.coordinates.latitude,
                            longitude: marker.coordinates.longitude,
                        }}
                        type={marker.type}
                        tooltip={marker.tooltip}
                        bgImg={marker.bgImg}
                    />
                ))}

                {optionalDirections.map((direction) => (
                    <Directions
                        key={direction.id}
                        type={direction.type}
                        origin={{
                            latitude: direction.origin.latitude,
                            longitude: direction.origin.longitude,
                        }}
                        destination={{
                            latitude: direction.destination.latitude,
                            longitude: direction.destination.longitude,
                        }}
                        onReady={(...args) => onDirectionsReady(direction.id, ...args)}
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
