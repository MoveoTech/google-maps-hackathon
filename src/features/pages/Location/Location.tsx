import React from "react";

import { LocationAutoComplete } from "../../components/LocationAutoComplete/LocationAutoComplete";
import { HomePageMap } from "../HomePage/HomePageMap";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import CircularLoader from "../../components/CircularLoader/CircularLoader";

const Location = () => {
  const { location, errorMsg } = useCurrentLocation();

  if (errorMsg) return <LocationAutoComplete onPredictionClicked={() => {}} />;
  if (!location) return <CircularLoader />;

  return <HomePageMap location={location} />;
};

export default Location;
