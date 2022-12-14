import {GOOGLE_MAPS_APIKEY} from "@env";
import axios from "axios";
import {Alert, Linking} from "react-native";
import {LatLng} from "react-native-maps";
import {NavigationPlaces} from "../features/components/TimelineComponent/TimelineComponent";
import {GoogleMapsPlaces, Location} from "../features/types";

const baseUrl = "https://maps.googleapis.com/maps/api";
export const PhotosBaseURL = `${baseUrl}/place/photo?maxwidth=400`;

export interface Viewport {
    northeast: Location;
    southwest: Location;
}

export interface Geometry {
    location: Location;
    viewport: Viewport;
}

export interface OpeningHours {
    open_now: boolean;
}

export interface PlusCode {
    compound_code: string;
    global_code: string;
}

export interface IPlace {
    business_status: string;
    geometry: Geometry;
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    opening_hours: OpeningHours;
    place_id: string;
    plus_code: PlusCode;
    price_level: number;
    rating: number;
    reference: string;
    scope: string;
    types: string[];
    user_ratings_total: number;
    vicinity: string;
    photos: {};
}

export interface INearByPlacesRes {
    html_attributions: any[];
    results: IPlace[];
    status: string;
}

export interface IAutocompletePlacesRes {
    predictions: IPrediction[];
    status: string;
}

export interface StructuredFormatting {
    main_text: string;
    matched_substrings: MatchedSubstring[];
    secondary_text: string;
}

export interface MatchedSubstring {
    length: number;
    offset: number;
}

export interface Term {
    offset: number;
    value: string;
}

export interface IPrediction {
    coords: any;
    description: string;
    matched_substrings: MatchedSubstring[];
    place_id: string;
    reference: string;
    structured_formatting: StructuredFormatting;
    terms: Term[];
    types: string[];
    main_text: string;
}

interface INearByPlacesApiRes {
    data: INearByPlacesRes;
}

interface IDistanceAndDuration {
    text: string;
    value: string;
}

interface IElement {
    elements: IDistanceAndDuration[];
}

interface IRows {
    rows: IElement[];
}

interface IDistanceMatrix {
    data: any;
    destination_addresses: string[];
    origin_addresses: string[];
    rows: IRows[];
    status: string;
}

interface IAutocompletePlacesApiRes {
    data: IAutocompletePlacesRes;
}

interface GeoCodingResults {
    address_components: {
        long_name: string;
        short_name: string;
        types: string[];
    }[];
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        location_type: string;
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    place_id: string;
    types: string[];
}

export interface IRevGeocodingRes {
    results: GeoCodingResults[];
}

export const getNearByPlaces = (
    location: LatLng,
    radius: number,
    type: GoogleMapsPlaces
): Promise<INearByPlacesApiRes> => {
    const params = {
        radius,
        type,
        keyword: type,
        key: GOOGLE_MAPS_APIKEY,
    };
    const nearbyPlacesUrl = `${baseUrl}/place/nearbysearch/json?location=${location.latitude}%2C${location.longitude}`;
    return axios.get(nearbyPlacesUrl, {params});
};

export const autocompletePlace = (
    input: string
    // location: Location,
    // radius: number
): Promise<IAutocompletePlacesApiRes> => {
    const params = {
        input: input,
        // radius,
        key: GOOGLE_MAPS_APIKEY,
    };
    // const nearbyPlacesUrl = `${baseUrl}/place/autocomplete/json?location=${location.lat}%2C${location.lng}`;
    const nearbyPlacesUrl = `${baseUrl}/place/autocomplete/json`;

    return axios.get(nearbyPlacesUrl, {params});
};

export const getDistanceCalculation = (
    origin_id: string,
    destinations_id: string
): Promise<IDistanceMatrix> => {
    const params = {
        origins: `place_id:${origin_id}`,
        destinations: `place_id:${destinations_id}`,
        units: "imperial",
        key: GOOGLE_MAPS_APIKEY,
    };
    const getDistance = `${baseUrl}/distancematrix/json`;
    return axios.get(getDistance, {params});
};

export const getDetails = (place_id: any): Promise<any> => {
    const params = {
        place_id: place_id,
        key: GOOGLE_MAPS_APIKEY,
    };
    const getDetails = `${baseUrl}/place/details/json`;
    return axios.get(getDetails, {params});
};

export const openGoogleMaps = async (data: NavigationPlaces) => {
    const {destinationId, destinationName, waypointsIds, waypointsNames, addressID, encodedName} = data;
    var url = `https://www.google.com/maps/dir/?api=1&origin=${encodedName}&origin_place_id=${addressID}&travelmode=walking&dir_action=navigate&destination=${destinationName}&destination_place_id=${destinationId}&waypoints=${waypointsNames}&waypoint_place_ids=${waypointsIds}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else Alert.alert(`Don't know how to open this URL: ${url}`);
};

export const reverseGeoCoding = async (
    lat: number,
    lng: number
): Promise<IRevGeocodingRes> => {
    try {
        const params = {
            key: GOOGLE_MAPS_APIKEY,
            latlng: `${lat},${lng}`,
        };
        const url = `${baseUrl}/geocode/json`;
        const res = (await axios.get(url, {params})) as {
            data: IRevGeocodingRes;
        };
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
