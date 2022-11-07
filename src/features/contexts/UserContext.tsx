import { LocationObject } from "expo-location";
import React, { useContext, createContext, FC } from "react";

import { useCurrentLocation } from "../hooks/useCurrentLocation";

export const UserContext = createContext<{
  currentLocation: LocationObject;
  errorMsg: any;
}>(null);

interface UserContextProps {
  children: React.ReactNode;
}
export const UserProvider: FC<UserContextProps> = ({ children }) => {
  const { location: currentLocation, errorMsg } = useCurrentLocation();
  console.log("ccccc", currentLocation);

  const value = {
    currentLocation,
    errorMsg,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
