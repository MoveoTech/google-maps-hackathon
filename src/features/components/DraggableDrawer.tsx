import React, {useCallback, useMemo, useRef} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import Typography from "./Typography/Typography";

export const DraggableDrawer = ({children}) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%", "60%", "88%"], []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

    let steps = [1, 2, 3, 4]

    const [activeStep, setActiveStep] = React.useState(1);
    const maxSteps = steps.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <View style={{display: 'flex', alignItems: 'center', marginTop: 5}}>
                <Typography style={{fontWeight: '500'}}>
                    Choose an amazing breakfast
                </Typography>
                <Typography>
                    Step {activeStep.toString()} out of {maxSteps.toString()}
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
});
