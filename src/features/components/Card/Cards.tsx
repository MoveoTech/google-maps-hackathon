import {ScrollView} from "react-native-gesture-handler";
import React, {useState} from "react";

import {InfoCard} from "./InfoCard";
import {IPlace} from "../../../api/googleApi";
import {Dimensions, StyleSheet, View} from "react-native";

export const Cards: React.FC<{ topFourPlaces: IPlace[] }> = ({topFourPlaces}) => {

    const [currentIndexPressed, setCurrentIndexPressed] = useState(0)

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.cardContainers}>
                {topFourPlaces?.map((place: object, index: number) =>
                    <InfoCard key={index} isPressed={currentIndexPressed === index} onPress={setCurrentIndexPressed}
                              index={index} places={place}
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