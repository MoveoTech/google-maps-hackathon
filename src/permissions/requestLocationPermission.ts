import * as CurrentLocation from "expo-location";

export const requestLocationPermission = async () => {
  let { status } = await CurrentLocation.requestForegroundPermissionsAsync();
  return status;
};
