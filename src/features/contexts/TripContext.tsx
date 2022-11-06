import {LocationObject} from "expo-location";
import React, {useContext, createContext, FC} from "react";

import {useCurrentLocation} from "../hooks/useCurrentLocation";

export const TripContext = createContext<{
    currentLocation: LocationObject;
    errorMsg: any;
}>(null);

interface TripContextProps {
    children: React.ReactNode;
}

export const TripInfoProvider: FC<TripContextProps> = ({children}) => {
    const {location: currentLocation, errorMsg} = useCurrentLocation();

    const value = {
        currentLocation,
        errorMsg,
    };

    return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

// export const useTripContext = () => useContext(TripInfoProvider);
