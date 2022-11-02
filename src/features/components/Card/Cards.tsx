import {ScrollView} from "react-native-gesture-handler";
import React, {useEffect, useState} from "react";

import {InfoCard} from "./InfoCard";
import {useCurrentLocation} from "../../hooks/useCurrentLocation";
import {getNearByPlaces} from "../../../api/googleApi";
import {GOOGLE_MAPS_APIKEY} from "@env";
import {Dimensions, StyleSheet, View} from "react-native";

export const Cards = () => {

    const [currentIndexPressed, setCurrentIndexPressed] = useState(0)
    const [places, setPlaces] = useState(null)
    const {location} = useCurrentLocation()

    useEffect(() => {
        if (!location) return
        const findNearbyPlaces = async () => {
            const nearbyPlaces = await getNearByPlaces(
                {latitude: location?.coords.latitude, longitude: location?.coords.longitude},
                400,
                "restaurant",
            );
            setPlaces(nearbyPlaces.data.results);
        };
        findNearbyPlaces();
    }, [location])

    const pricing = (price_level) => {
        if (price_level > 3) {
            return '$'
        } else if (price_level > 1 && price_level < 3) {
            return '$$'
        } else {
            return '$$$'
        }
    }

    const PhotosBaseURL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.cardContainers}>
                {places?.slice(0, 4).map((x: any, index: any) =>
                    <InfoCard key={index} isPressed={currentIndexPressed === index} onPress={setCurrentIndexPressed}
                              index={index} name={x?.name} rating={x?.rating} price_level={pricing(x?.price_level)}
                              editorial_summary={x?.types.slice(0, 1).join(', ')} vicinity={20}
                              photo={`${PhotosBaseURL}${x?.photos[0].photo_reference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`}
                    />
                )}
            </ScrollView>
        </View>
    )
}

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