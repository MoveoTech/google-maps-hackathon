import { useEffect, useState } from "react";
import * as Location from "expo-location";

const mockLocation = {
  coords: {
    accuracy: 35,
    altitude: 27.983800888061523,
    altitudeAccuracy: 1.3736238479614258,
    heading: -1,
    latitude: 32.06388108937858,
    longitude: 34.7729407013912,
    speed: -1,
  },
  timestamp: 1666617989710.852,
};

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (e) {
        setErrorMsg(e);
      }
    })();
  }, []);

  return { location, errorMsg };
};
