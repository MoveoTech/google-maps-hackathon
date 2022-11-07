import React from "react";
import { LocationAutoComplete } from "../../components/LocationAutoComplete/LocationAutoComplete";
import { useUser } from "../../contexts/UserContext";
import { HomePageMap } from "../HomePage/HomePageMap";
import Loader from "../../components/Loader/Loader";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";

const Location = () => {
  // const { currentLocation, errorMsg } = useUser();
  const { location, errorMsg } = useCurrentLocation();

  if (errorMsg) return <LocationAutoComplete />;
  if (!location) return <Loader />;

  return <HomePageMap location={location} />;
};

export default Location;
