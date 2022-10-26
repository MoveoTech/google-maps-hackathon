import { GOOGLE_MAPS_APIKEY } from "@env";
import axios from "axios";
import { INearByPlaces } from "../hooks/useNearbyPlaces";
import {Location} from "../types";

const baseUrl = "https://maps.googleapis.com/maps/api";

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
}

export interface INearByPlacesRes {
  html_attributions: any[];
  results: IPlace[];
  status: string;
}

interface INearByPlacesApiRes {
  data: INearByPlacesRes;
}

export const getNearByPlaces = (
  options: Location & INearByPlaces
): Promise<INearByPlacesApiRes> => {
  const { lat, lng, radius, type } = options;
  const params = {
    radius,
    type,
    key: GOOGLE_MAPS_APIKEY,
  };
  const nearbyPlacesUrl = `${baseUrl}/place/nearbysearch/json?location=${lat}%2C${lng}`;
  return axios.get(nearbyPlacesUrl, { params });
};

export const autocompletePlace = (
  input: string
  // location: Location,
  // radius: number
): Promise<any> => {
  const params = {
    input: input,
    // radius,
    key: GOOGLE_MAPS_APIKEY,
  };
  // const nearbyPlacesUrl = `${baseUrl}/place/autocomplete/json?location=${location.lat}%2C${location.lng}`;
  const nearbyPlacesUrl = `${baseUrl}/place/autocomplete/json`;

  return axios.get(nearbyPlacesUrl, { params });
};

export const getDistanceCalculation = (origins: string, destinations: string): Promise<any> => {
  const params = {
    origins: `place_id:${origins}`,
    destinations: `place_id:${destinations}`,
    units: "imperial",
    key: GOOGLE_MAPS_APIKEY,
  }
  const getDistance = `${baseUrl}/distancematrix/json`;
  return axios.get(getDistance, { params });
}