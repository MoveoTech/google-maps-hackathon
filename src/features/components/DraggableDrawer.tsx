import React, { useCallback, useEffect, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Dimensions, ScrollView, StyleSheet, View, Text } from "react-native";
import Typography from "./Typography/Typography";
import { Button } from "react-native-paper";

interface Props {
  activeStep: number;
  children;
  maxSteps;
  setActiveStep: (activeStep: number) => void;
  topTitle: string;
}

export const DraggableDrawer = ({
  children,
  activeStep,
  maxSteps,
  setActiveStep,
  topTitle,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "60%", "88%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View>
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetFlatList
        data={data}
        keyExtractor={(i) => i}
        renderItem={renderItem}
      >
        <View style={styles.topViewWrapper}>
          <Button
            icon={require("../../../assets/pin.png")}
            onPress={() => setActiveStep(activeStep - 1)}
            children={""}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Typography style={{ fontWeight: "500" }}>{topTitle}</Typography>
          <Typography>
            Step {activeStep.toString()} out of {maxSteps.toString()}
          </Typography>
        </View>
        <View style={styles.bottomContainer} />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.cardContainers}>
            {children}
          </ScrollView>
        </View>
      </BottomSheetFlatList>
    </BottomSheet>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  cardContainers: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    display: "flex",
    marginTop: 20,
  },
  bottomContainer: {
    marginTop: 15,
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topViewWrapper: {
    position: "absolute",
    zIndex: 200,
  },
});
