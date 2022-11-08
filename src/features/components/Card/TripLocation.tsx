import * as React from "react";
import {TextInput} from "react-native-paper";
import {View, Dimensions} from "react-native";
import Typography from "../Typography/Typography";
import {useEffect, useState} from "react";
import {LocationAutoComplete} from "../LocationAutoComplete/LocationAutoComplete";

interface Props {
    onPredictionClicked: (place_id: string) => void;
}

export const TripLocation = ({onPredictionClicked}: Props) => {
    //
    // const [location, setLocation] = useState('')
    //
    // useEffect(() => {
    //     setSpecifiedLoc(location)
    // }, [location])

    return (
        <View style={{width: Dimensions.get("window").width * 0.9}}>
            <Typography
                style={{marginBottom: 15, fontSize: 18}}
                fontFamily="Avenir-heavy"
            >
                Where would you like to travel to?
            </Typography>
            <LocationAutoComplete onPredictionClicked={onPredictionClicked}/>
            {/*<TextInput*/}
            {/*    mode='outlined'*/}
            {/*    label="Travel to"*/}
            {/*    value={location}*/}
            {/*    onChangeText={locationValue => setLocation(locationValue)}*/}
            {/*/>*/}
        </View>
    );
};
