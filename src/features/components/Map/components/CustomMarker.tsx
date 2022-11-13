import React from "react";
import {Image, View, Text, StyleSheet, ImageBackground} from "react-native";
import {LatLng, Marker} from "react-native-maps";
import {DARK_NAVY} from "../../../globalStyle";
import {GoogleMapsPlaces} from "../../../types";

export type MarkerTypes = "dot" | "circle" | "pin";

interface MarkerProps {
    type: MarkerTypes;
    tooltip?: string;
    coordinates: LatLng;
    bgImg?: string;
    bgIcon?: GoogleMapsPlaces;
    isSelected: boolean;
    timeToPlace?: number;
    getIconByPlaceType?: (type: GoogleMapsPlaces) => JSX.Element
}

type MarkersObj = {
    [key in MarkerTypes]?: { path: number; style: {} };
};
const MARKERS: MarkersObj = {
    dot: {path: require("../../../../../assets/dot.png"), style: {}},
    circle: {path: require("../../../../../assets/circle.png"), style: {}},
    pin: {
        path: require("../../../../../assets/pin.png"),
        style: {width: 25, height: 30},
    },
};
export const CustomMarker = ({
                                 type,
                                 tooltip,
                                 coordinates,
                                 bgImg,
                                 bgIcon,
                                 isSelected,
                                 timeToPlace,
                                 getIconByPlaceType
                             }: MarkerProps) => {

    return (
        <Marker coordinate={coordinates} zIndex={type === "pin" ? (isSelected ? 2 : 1) : 0}>
            {!!tooltip && (
                <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>{tooltip}</Text>
                </View>
            )}
            {!!(isSelected && timeToPlace) && (
                <View style={{...styles.timeToPlace,}}>
                    <ImageBackground
                        source={require("../../../../../assets/WalkWhite.png")}
                        style={{
                            width: 17,
                            height: 17,
                        }}
                    />
                    <Text style={styles.timeToPlaceText}>
                        {Math.round(timeToPlace)} min
                    </Text>
                </View>
            )}
            <View style={styles.MarkerContainer}>
                {!!(bgIcon || bgImg) && (
                    <>
                        {!!isSelected ? (
                            <>
                                <View style={{height: 6}}></View>
                                <View
                                    style={{...styles.BgImageContainer, width: 65, height: 65}}
                                >


                                    <ImageBackground
                                        source={{uri: bgImg}}
                                        style={{...styles.BgImage, width: 55, height: 55}}
                                    />
                                </View>
                            </>
                        ) : (
                            <View
                                style={{
                                    ...styles.BgImageContainer,
                                    width: 45,
                                    height: 45,
                                }}
                            >

                                {getIconByPlaceType(bgIcon as GoogleMapsPlaces)}
                            </View>
                        )}
                    </>
                )}
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    tooltip: {
        backgroundColor: "#fff",
        paddingHorizontal: 7,
        paddingVertical: 1,
        borderRadius: 40,
        height: 18,
        marginBottom: 3,
    },
    tooltipText: {
        color: "#222222",
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 16,
    },
    MarkerContainer: {
        display: "flex",
        alignItems: "center",
    },
    BgImageContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 6,
    },
    BgImage: {
        borderRadius: 6,
        overflow: "hidden",
    },
    timeToPlace: {
        backgroundColor: DARK_NAVY,
        borderRadius: 10,
        height: 30,
        width: 68,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",

    },
    timeToPlaceText: {
        color: "#ffffff",
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 16,
    },
});
