import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import Map from "../../components/Map/Map";

import WizardComponent from "../../components/Wizard/WizardComponent";

const HomePage = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Celine the Queen!</Text>
      {/* <Text>Here is going to be the map in the background</Text> */}
      {!isWizardOpen && <Map />}
      {isWizardOpen ? (
        <WizardComponent />
      ) : (
        <Button onPress={() => setIsWizardOpen(true)} title="Start" />
      )}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    padding: 20,
    width: "100%",
    backgroundColor: "#78b9e4",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
  },
});
