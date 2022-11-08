import React, {useCallback, useMemo, useRef} from "react";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import Typography from "./Typography/Typography";

interface Props {
    children;
    topTitle: string;
    subTitle: string;
    onBoarding: boolean
}

export const DraggableDrawer = ({
                                    children,
                                    topTitle,
                                    subTitle,
                                    onBoarding
                                }: Props) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["45%", "60%", "90%"], []);

    const handleSheetChanges = useCallback((index: number) => {
        // console.log("handleSheetChanges", index);
    }, []);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onChange={handleSheetChanges}
        >
            {!onBoarding &&
							<>
								<View style={{alignItems: "center"}}>
									<Typography style={{fontWeight: "500"}}>{topTitle}</Typography>
									<Typography>{subTitle}</Typography>
								</View>
								<View style={styles.bottomContainer}/>
							</>
            }
            <BottomSheetView style={styles.container}>
                <ScrollView contentContainerStyle={styles.cardContainers}>
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
        height: 400
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
