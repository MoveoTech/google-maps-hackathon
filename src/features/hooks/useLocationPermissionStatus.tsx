import { useState, useEffect } from "react";
import * as CurrentLocation from "expo-location";
import { requestLocationPermission } from "../../permissions/requestLocationPermission";

export const useLocationPermissionStatus = () => {
  const [locationStatus, setLocationStatus] =
    useState<CurrentLocation.PermissionStatus>();

  const RequestLocation = async () => {
    const status = await requestLocationPermission();
    setLocationStatus(status);
  };

  useEffect(() => {
    RequestLocation();
  }, []);
  return { locationStatus };
};
