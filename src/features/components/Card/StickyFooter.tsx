import * as React from "react";
import {Card, Button} from "react-native-paper";
import {Alert, Dimensions, Linking, StyleSheet, Text} from "react-native";
import {openGoogleMaps, reverseGeoCoding} from "../../../api/googleApi";
import {NavigationPlaces} from "../TimelineComponent/TimelineComponent";
import {IPlaceOnMap} from "../../pages/HomePage/HomePageMap";
import {Logs} from "expo";
import {useEffect, useState} from "react";

interface Props {
    next: (isLastStep: boolean) => void;
    isNextDisabled: boolean;
    skip: (isLastStep: boolean) => void;
    isLast: boolean;
    onBoarding: boolean;
    continueCallback: () => void;
    showTimeline: boolean;
    tripPlaces: IPlaceOnMap[];
    address: string;
    addressID: string
}

export interface NavigationPlaces {
    destinationId: string;
    destinationName: string;
    waypointsIds: string;
    waypointsNames;
    locationID: string;
    fullName: string;
}

export const StickyFooter = ({
                                 next,
                                 isLast,
                                 tripPlaces,
                                 showTimeline,
                                 skip,
                                 isNextDisabled,
                                 onBoarding,
                                 continueCallback,
                                 address,
                                 addressID
                             }: Props) => {

    const openGoogleMaps = async (data: NavigationPlaces) => {
        console.log("DATA: ", data)
        const {destinationId, destinationName, waypointsIds, waypointsNames, addressID, encodedName} = data;
        var url = `https://www.google.com/maps/dir/?api=1&origin=${encodedName}&origin_place_id=${addressID}&travelmode=walking&dir_action=navigate&destination=${destinationName}&destination_place_id=${destinationId}&waypoints=${waypointsNames}&waypoint_place_ids=${waypointsIds}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) await Linking.openURL(url);
        else Alert.alert(`Don't know how to open this URL: ${url}`);
    };

    const prepareNavigationPlaces = (): NavigationPlaces => {
        const navigationPlaces = tripPlaces.map((place) => ({
            id: place.place_id,
            name: place.name.replace(/ /g, "+"),
        }));
        const destination = navigationPlaces.pop();
        const encodedName = encodeURIComponent(address)

        return {
            addressID: addressID || "",
            encodedName: encodedName || "",
            destinationId: destination?.id || "",
            destinationName: destination?.name || "",
            waypointsIds: navigationPlaces.map((place) => place.id).join("%7C"),
            waypointsNames: navigationPlaces.map((place) => place.name).join("%7C")
        };
    };

    const {destinationId, destinationName, waypointsIds, waypointsNames} =
        prepareNavigationPlaces();

    return (
        <Card style={{marginTop: "auto", height: 200, justifyContent: "center"}}>
            <Card.Content style={styles.container}>
                {onBoarding ? (
                    <Button
                        mode="contained"
                        style={styles.continue}
                        onPress={continueCallback}
                    >
                        Continue
                    </Button>
                ) : !showTimeline && (
                    <>
                        <Text style={styles.skipButton} onPress={() => skip(isLast)}>
                            Skip Experience
                        </Text>
                        <Button
                            disabled={isNextDisabled}
                            buttonColor="black"
                            mode="contained"
                            labelStyle={{color: "white"}}
                            style={{width: 120, borderRadius: 10}}
                            onPress={() => next(isLast)}
                        >
                            Next
                        </Button>
                    </>
                )}
                {showTimeline &&
									<Button
										buttonColor="black"
										mode={"contained"}
										labelStyle={{color: "white"}}
										style={styles.navigateButton}
										onPress={() =>
                        openGoogleMaps({
                            address,
                            addressID,
                            destinationId,
                            destinationName,
                            waypointsIds,
                            waypointsNames,
                        })
                    }
									>
										Navigate with Google maps
									</Button>
                }
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    skipButton: {
        color: "black",
        textDecorationLine: "underline",
        alignSelf: "center",
    },
    continue: {
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        width: Dimensions.get("window").width * 0.9,
        backgroundColor: "black",
    },
    navigateButton: {
        display: 'flex',
        justifyContent: 'center',
        width: Dimensions.get("window").width * 0.9,
        alignItem: 'center',
        borderRadius: 10,
    },
});
