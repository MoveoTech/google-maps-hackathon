import { useEffect, useState } from "react";
import * as CurrentLocation from "expo-location";
import { LocationObject } from "expo-location";

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<LocationObject>();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let currentLocation = await CurrentLocation.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (e) {
        setErrorMsg(e);
      }
    })();
  }, []);

  return { location, errorMsg };
};
