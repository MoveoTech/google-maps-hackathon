import {ScrollView} from "react-native-gesture-handler";
import React, {useState} from "react";
import * as _ from "lodash";

import {InfoCard} from "./InfoCard";
import {styles} from "../DraggableDrawer";

export const Cards = () => {

    const [currentIndexPressed, setCurrentIndexPressed] = useState(0)

    return (
        <ScrollView contentContainerStyle={styles.cardContainers}>
            {_.times(4).map((index) =>
                <InfoCard key={index} isPressed={currentIndexPressed === index} onPress={setCurrentIndexPressed}
                          index={index}/>
            )}
        </ScrollView>
    )
}