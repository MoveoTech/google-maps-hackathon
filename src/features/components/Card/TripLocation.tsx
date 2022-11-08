import * as React from "react";
import {View, Dimensions, Text} from "react-native";
import Typography from "../Typography/Typography";
import {LocationAutoComplete} from "../LocationAutoComplete/LocationAutoComplete";

interface Props {
    onPredictionClicked: (place_id: string) => void;
}

export const TripLocation = ({onPredictionClicked}: Props) => {


    return (
        <View style={{width: Dimensions.get("window").width * 0.9}}>
            <Typography
                style={{marginBottom: 5, fontSize: 18}}
                fontFamily="Avenir-heavy"
            >
                Where would you like to travel to?
            </Typography>
            <Text style={{marginBottom: 15}}>(Press continue if you would like to use your current location)</Text>
            <LocationAutoComplete onPredictionClicked={onPredictionClicked}/>
        </View>
    );
};
