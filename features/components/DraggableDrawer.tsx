import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

export const DraggableDrawer = ({children}) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['25%', '60%', '98%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return <View style={styles.container}>
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            {children}
        </BottomSheet>
    </View>;
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
        paddingBottom: 150,
    },
});

