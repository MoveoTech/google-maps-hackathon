import React, { useCallback, useEffect, useMemo, useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Typography from "./Typography/Typography";
import { Button } from "react-native-paper";

interface Props {
  activeStep: number;
  children;
  maxSteps;
  setActiveStep: (activeStep: number) => void;
  topTitle: string;
  subTitle: string;
}

export const DraggableDrawer = ({
  children,
  activeStep,
  maxSteps,
  setActiveStep,
  topTitle,
  subTitle,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "60%", "88%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {});

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <View style={styles.topViewWrapper}>
        <Button
          icon={require("../../../assets/chevron.png")}
          onPress={() => setActiveStep(activeStep - 1)}
          children={""}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Typography style={{ fontWeight: "500" }}>{topTitle}</Typography>
        <Typography>{subTitle}</Typography>
      </View>
      <View style={styles.bottomContainer} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.cardContainers}>
          {children}
        </ScrollView>
      </View>
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
    paddingBottom: 250,
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
