import React, {useState, useEffect} from "react";
import {View, Text} from "react-native";
import {
    autocompletePlace,
    getDetails,
    IPrediction,
} from "../../../api/googleApi";
import useDebounce from "../../hooks/useDebounce";
import {Button, TextInput} from "react-native-paper";

interface Props {
    onPredictionClicked: (place_id: string) => void;
}

export const LocationAutoComplete = ({onPredictionClicked}: Props) => {
    const [manualLocation, setManualLocation] = useState("");
    const debouncedValue = useDebounce<string>(manualLocation, 1000);

    const [selectedManualLocation, setSelectedManualLocation] = useState();
    const [locationsToSelect, setLocationsToSelect] = useState<IPrediction[]>();
    const onTypeLocation = (input: string) => {
        setManualLocation(input);
    };

    const handleAutoComplete = async () => {
        const locations = await autocompletePlace(debouncedValue);
        setLocationsToSelect(locations.data.predictions);
        // console.log("locations", locations.data.predictions);
    };

    const onSelectLocation = (place_id: string) => {
        onPredictionClicked(place_id);
    };

    useEffect(() => {
        if (!debouncedValue) return;
        handleAutoComplete();
    }, [debouncedValue]);

    return (
        <View>
            {/*<Text>select starting location:</Text>*/}
            <TextInput
                mode="outlined"
                label="Travel to"
                placeholder="type location"
                value={manualLocation}
                onChangeText={onTypeLocation}
            />
            {locationsToSelect?.map((location) => (
                <Button
                    labelStyle={{color: "black"}}
                    mode="outlined"
                    style={{
                        marginTop: 20,
                        marginLeft: 5,
                        borderRadius: 5,
                    }}
                    key={location.main_text}
                    onPress={() => onSelectLocation(location.place_id)}
                >
                    {console.log(location)}
                    {location.structured_formatting.main_text}
                </Button>
            ))}
        </View>
    );
};
