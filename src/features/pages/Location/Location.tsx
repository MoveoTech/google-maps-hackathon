import React from "react";

import { LocationAutoComplete } from "../../components/LocationAutoComplete/LocationAutoComplete";
import { HomePageMap } from "../HomePage/HomePageMap";
import Loader from "../../components/Loader/Loader";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";

const Location = () => {
  const { location, errorMsg } = useCurrentLocation();

  if (errorMsg) return <LocationAutoComplete />;
  if (!location) return <Loader />;

  return <HomePageMap location={location} />;
};

export default Location;
