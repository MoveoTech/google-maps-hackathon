import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  NativeModules,
  Platform,
  Linking,
} from "react-native";
import * as Location from "expo-location";

import Typography from "../../components/Typography/Typography";
import backgroundImage from "../../../../assets/welcome.png";
import likeImage from "../../../../assets/like.png";
import locationImage from "../../../../assets/location.png";
import { MAIN, TERTIARY } from "../../globalStyle";
import Button from "../../components/Button/Button";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";
import { requestLocationPermission } from "../../../permissions/requestLocationPermission";
import { useAppStateChange } from "../../hooks/useAppStateChange";

const onOpen = {
  title: "Permission to access location was denied",
  isCheckIcon: false,
};
const { RNAndroidOpenSettings } = NativeModules;

const AllowLocation = ({ navigation, currentLocationPermission }) => {
  const { openSnackbar, hideSnackbar, snackbar } = useSnackbar();
  const [locationPermission, setLocationPermission] =
    useState<Location.LocationPermissionResponse>(currentLocationPermission);
  const { status, requestPermission } = requestLocationPermission();

  useAppStateChange(() => checkLocationPermission());

  const checkLocationPermission = async () => {
    try {
      const status = await requestPermission();
      if (status.granted) {
        navigation.navigate("Location");
      } else {
        setLocationPermission(status);
        openSnackbar(onOpen);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      RNAndroidOpenSettings.appDetailsSettings();
    }
  };

  return (
    <View style={styles.container}>
      <Image source={backgroundImage} />
      <View style={styles.titleWrapper}>
        <Typography fontSize="xxl" weight="900">
          We need access to Location
        </Typography>
        <Typography style={styles.subTitle} fontSize="l" weight="400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Velit nulla
          ut vestibulum erat accumsan sagittis interdum quam.
        </Typography>
      </View>
      <Image source={locationImage} />
      <Snackbar
        label={snackbar.title}
        isCheckIcon={snackbar.isCheckIcon}
        visible={snackbar.isVisible}
        hide={hideSnackbar}
      />
      <View style={styles.footer}>
        <Image source={likeImage} />
        <Typography fontSize="l" style={styles.textFooter}>
          It is very important that you choose the Always Allow option in the
          next dialog. It makes the system work better. Thank you.
        </Typography>
        <Button
          title={
            locationPermission?.status === "denied"
              ? "Open settings to grant location permission"
              : "Grant access to location"
          }
          onPress={
            locationPermission?.status === "denied"
              ? openAppSettings
              : checkLocationPermission
          }
        />
      </View>
    </View>
  );
};

export default AllowLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  titleWrapper: {
    position: "absolute",
    top: 0,
    width: "100%",
    marginTop: 70,
  },
  subTitle: {
    marginTop: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    backgroundColor: TERTIARY,
    borderTopWidth: 0.8,
    borderTopColor: MAIN,
    height: "32%",
    width: Dimensions.get("window").width,
  },
  textFooter: {
    marginTop: 0,
    marginVertical: 26,
  },
});
