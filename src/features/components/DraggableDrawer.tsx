import React, { useCallback, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Dimensions, StyleSheet, View } from "react-native";

import Typography from "./Typography/Typography";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  children;
  topTitle: string;
  subTitle: string;
  onBoarding: boolean;
}

export const DraggableDrawer = ({
  children,
  topTitle,
  subTitle,
  onBoarding,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "60%", "90%"], []);
  const [snapIndex, setSnapIndex] = useState<number>(1);

  const handleSheetChanges = useCallback((index: number) => {
    setSnapIndex(index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={2}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      {!onBoarding && (
        <>
          <View style={{ alignItems: "center" }}>
            <Typography style={{ fontWeight: "500" }}>{topTitle}</Typography>
            <Typography>{subTitle}</Typography>
          </View>
          <View style={styles.bottomContainer} />
        </>
      )}
      <BottomSheetView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.cardContainers,
            { minHeight: snapIndex === 1 ? 430 : 0 },
          ]}
        >
          {children}
        </ScrollView>
      </BottomSheetView>
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
