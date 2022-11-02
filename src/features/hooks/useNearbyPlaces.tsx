import {useEffect, useState} from "react";
import {getNearByPlaces, IPlace} from "../../api/googleApi";
import {GoogleMapsPlaces, Location} from "../types";

export interface INearByPlaces {
    radius: number;
    type: GoogleMapsPlaces;
}

export const useNearbyPlaces = (
    currentLocation: Location,
    nearByPlacesOptions: INearByPlaces
) => {
    const [places, setPalces] = useState<IPlace[]>();
    const {lat, lng} = currentLocation;
    const {type, radius} = nearByPlacesOptions;

    const findNearbyPlaces = async () => {
        const nearbyPlaces = await getNearByPlaces({lat, lng, type, radius});
        console.log(nearbyPlaces)
        setPalces(nearbyPlaces.data.results);
    };

    useEffect(() => {
        if (!lat || !lng) return;
        findNearbyPlaces();
    }, []);

    return {places};
};
