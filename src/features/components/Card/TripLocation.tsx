import * as React from "react";
import {View, Dimensions, Text} from "react-native";
import Typography from "../Typography/Typography";
import {LocationAutoComplete} from "../LocationAutoComplete/LocationAutoComplete";

interface Props {
    onPredictionClicked: (place_id: string) => void;
    currentLocationLat: number;
    currentLocationLng: number
}

export const TripLocation = ({onPredictionClicked, currentLocationLat, currentLocationLng}: Props) => {


    return (
        <View style={{width: Dimensions.get("window").width * 0.9}}>
            <Typography
                style={{marginBottom: 20, fontSize: 18}}
                fontFamily="Avenir-heavy"
            >
                Where would you like to travel to?
            </Typography>
            <LocationAutoComplete onPredictionClicked={onPredictionClicked} currentLocationLat={currentLocationLat}
                                  currentLocationLng={currentLocationLng}/>
        </View>
    );
};
