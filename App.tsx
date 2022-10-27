import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import * as CurrentLocation from "expo-location";

import HomePage from "./features/pages/HomePage/HomePage";
import { requestLocationPermission } from "./features/permissions/requestLocationPermission";
import { AppContainer } from "./features/globalStyle";
import { UserProvider } from "./features/contexts/UserContext";
import { testApi } from "./features/api/api";

export default function App() {
  const [locationStatus, setLocationStatus] =
    useState<CurrentLocation.PermissionStatus>();

  const RequestLocation = async () => {
    const status = await requestLocationPermission();
    setLocationStatus(status);
  };

  useEffect(() => {
    RequestLocation();
  }, []);

  return (
    <UserProvider>
      <AppContainer>
        {locationStatus === "granted" ? (
          <HomePage />
        ) : (
          <Text>Allow location services to use app</Text>
        )}
        <StatusBar style="auto" />
      </AppContainer>
    </UserProvider>
  );
}
