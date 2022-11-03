import React, { useCallback, useMemo, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native";

export const DraggableDrawer = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "60%", "88%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <ScrollView>
        <BottomSheetView style={{ flex: 1, paddingBottom: 250 }}>
          {children}
        </BottomSheetView>
      </ScrollView>
    </BottomSheet>
  );
};
