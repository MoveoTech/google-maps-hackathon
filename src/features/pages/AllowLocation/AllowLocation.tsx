import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Platform,
  Linking,
} from "react-native";
import * as Location from "expo-location";

import { requestLocationPermission } from "../../../permissions/requestLocationPermission";
import Typography from "../../components/Typography/Typography";
import Button from "../../components/Button/Button";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useAppStateChange } from "../../hooks/useAppStateChange";
import likeImage from "../../../../assets/like.png";
import locationImage from "../../../../assets/location.png";
import { MAIN, TERTIARY } from "../../globalStyle";

const onOpen = {
  title: "Permission to access location was denied",
  isCheckIcon: false,
};
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
      Linking.openSettings();
    }
  };

  const isPermissionStatusDenied =
    (locationPermission?.android && locationPermission.canAskAgain) ||
    (!locationPermission?.android && locationPermission?.status === "denied");

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Typography fontSize="xxl" weight="900">
          We need access to Location
        </Typography>
        <Typography style={styles.subTitle} fontSize="l" weight="400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
      </View>
      <Image source={locationImage} style={{ marginTop: 24 }} />
      <Snackbar
        label={snackbar.title}
        isCheckIcon={snackbar.isCheckIcon}
        visible={snackbar.isVisible}
        hide={hideSnackbar}
      />
      <View style={styles.footer}>
        <Image source={likeImage} style={{ marginBottom: 12 }} />
        <Typography fontSize="l" style={styles.textFooter}>
          It is very important that you choose the Always Allow option in the
          next dialog. It makes the system work better. Thank you.
        </Typography>
        {isPermissionStatusDenied ? (
          <Button
            title={"Open settings to grant location permission"}
            onPress={openAppSettings}
          />
        ) : (
          <Button
            title={"Grant access to location"}
            onPress={checkLocationPermission}
          />
        )}
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
    width: "100%",
    marginTop: 16,
  },
  subTitle: {
    marginTop: 16,
  },
  footer: {
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
