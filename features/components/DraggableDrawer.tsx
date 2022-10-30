import React, {useCallback, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const DraggableDrawer = () => {
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => [300, '90%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const handleSnapPress = useCallback((index) => {
        bottomSheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    // renders
    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <Button title="Close" onPress={() => handleClosePress()} />
            <View style={styles.contentContainer}>
                <Text>Awesome 🎉 celine is so sexyyyy</Text>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: 'center',
        height: 2000,
        backgroundColor: 'red',
    },
});

export default DraggableDrawer;