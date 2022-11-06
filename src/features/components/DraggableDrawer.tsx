import React, {useCallback, useMemo, useRef} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import Typography from "./Typography/Typography";
import {Button} from "react-native-paper";
import {StickyFooter} from "./Card/StickyFooter";

interface Props {
    activeStep: number;
    children;
    maxSteps;
    topTitle: string;
}

export const DraggableDrawer = ({
                                    children,
                                    activeStep,
                                    maxSteps,
                                    topTitle,
                                }: Props) => {
    let snapIndex;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "60%", "88%"], []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
        return snapIndex = index
    }, []);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <View style={{alignItems: "center"}}>
                <Typography style={{fontWeight: "500"}}>{topTitle}</Typography>
                <Typography>
                    {(activeStep <= 4 &&
                            `Step ${activeStep.toString()} out of ${maxSteps.toString()}`) ||
                        "<Duration of the trip>"}
                </Typography>
            </View>
            <View style={styles.bottomContainer}/>
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
