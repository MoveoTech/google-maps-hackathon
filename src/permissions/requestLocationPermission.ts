import * as CurrentLocation from "expo-location";

// export const requestLocationPermission = async () => {
//   let { status } = await CurrentLocation.requestForegroundPermissionsAsync();
//   return status;
// };
export const requestLocationPermission = () => {
  let [status, requestPermission] = CurrentLocation.useForegroundPermissions();
  return { status, requestPermission };
};
