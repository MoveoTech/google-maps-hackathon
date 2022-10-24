import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import * as CurrentLocation from "expo-location";

import HomePage from "./features/pages/HomePage/HomePage";
import { requestLocationPermission } from "./features/permissions/requestLocationPermission";

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
    <View style={styles.container}>
      {locationStatus === "granted" ? (
        <HomePage />
      ) : (
        <Text>Allow location services to use app</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
