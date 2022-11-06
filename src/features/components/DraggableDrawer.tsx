import React, { useCallback, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  // ScrollView,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";

export const DraggableDrawer = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "60%", "88%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      {/* <View style={styles.container}> */}
      <NativeViewGestureHandler disallowInterruption>
        <ScrollView contentContainerStyle={styles.cardContainers}>
          {children}
        </ScrollView>
      </NativeViewGestureHandler>
      {/* </View> */}
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
    marginTop: 30,
  },
});
