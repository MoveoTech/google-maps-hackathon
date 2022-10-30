import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {FoodCard} from "./FoodCard";
import {
    ScrollView,
} from 'react-native-gesture-handler';


export const DraggableDrawer = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['25%', '40%', '98%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const count = [1, 2, 3, 4]

    return <View style={styles.container}>
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <ScrollView contentContainerStyle={styles.cardContainers}>
                {count.map(() =>
                    <FoodCard/>
                )}
            </ScrollView>
        </BottomSheet>
    </View>;
};

const styles = StyleSheet.create({
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

