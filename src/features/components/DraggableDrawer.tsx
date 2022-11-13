import React, {useCallback, useMemo, useRef, useState} from "react";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {Dimensions, StyleSheet, View, Text} from "react-native";

import Typography from "./Typography/Typography";
import {ScrollView} from "react-native-gesture-handler";

interface Props {
    children;
    topTitle: string;
    subTitle: string;
    onBoarding: boolean;
    snapIndex: 0 | 1 | 2;
    handleSheetChanges: (index: number) => void;
}

export const DraggableDrawer = ({
                                    children,
                                    topTitle,
                                    subTitle,
                                    onBoarding,
                                    snapIndex,
                                    handleSheetChanges,
                                }: Props) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "60%", "90%"], []);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={snapIndex}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            {!onBoarding && (
                <>
                    <View style={{alignItems: "center"}}>
                        <Typography style={{fontWeight: "500", fontFamily: "Avenir-regular"}}>{topTitle}</Typography>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                            {subTitle.split(' ').map((word, index) => {
                                const isBold = !!Number(word) && index === 1
                                return <Typography
                                    key={word + index}
                                    style={{
                                        fontFamily: 'Avenir-regular',
                                        fontWeight: isBold ? '900' : 'normal'
                                    }}>{word}{" "}</Typography>
                            })}
                        </View>

                    </View>
                    <View style={styles.bottomContainer}/>
                </>
            )}
            <BottomSheetView style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={[
                        styles.cardContainers,
                        {minHeight: snapIndex === 1 ? 350 : 0},
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
