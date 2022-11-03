import React, {useCallback, useMemo, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";

export const DraggableDrawer = ({children,}) => {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '60%', '88%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
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
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        display: "flex",
        marginTop: 30,
    },
});



