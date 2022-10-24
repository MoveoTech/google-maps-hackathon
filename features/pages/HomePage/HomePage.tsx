import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import Map from "../../components/Map/Map";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";

const HomePage = () => {
  const { location, errorMsg } = useCurrentLocation();

  if (errorMsg) return <Text>{errorMsg}</Text>;
  if (!location) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <Map location={location} />
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#78b9e4",
  },
});
