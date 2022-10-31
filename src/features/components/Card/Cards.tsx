import {InfoCard} from "./InfoCard";
import {ScrollView} from "react-native-gesture-handler";
import React, {useState} from "react";
import {styles} from "../DraggableDrawer";

const _ = require("lodash");

export const Cards = () => {

    const [currentIndexPressed, setCurrentIndexPressed] = useState(0)

    return (
        <ScrollView contentContainerStyle={styles.cardContainers}>
            {_.times(4).map((index) =>
                <InfoCard isPressed={currentIndexPressed === index} onPress={setCurrentIndexPressed}
                          index={index}/>
            )}
        </ScrollView>
    )
}