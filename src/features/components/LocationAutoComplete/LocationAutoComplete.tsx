import React, {useState, useEffect} from "react";
import {StyleSheet, Text} from "react-native";
import {
    autocompletePlace,
    IPrediction, reverseGeoCoding,
} from "../../../api/googleApi";
import useDebounce from "../../hooks/useDebounce";
import {List, Provider, TextInput} from "react-native-paper";
import hairlineWidth = StyleSheet.hairlineWidth;
import cross from '../../../../assets/cross.png';
import locationVector from '../../../../assets/Vector.png'

interface Props {
    onPredictionClicked: (place_id: string) => void;
    currentLocationLat?: number;
    currentLocationLng?: number;
}

export const LocationAutoComplete = ({onPredictionClicked, currentLocationLat, currentLocationLng}: Props) => {
    const [loc, setLoc] = useState("");
    const debouncedValue = useDebounce<string>(loc, 1000);
    const [selected, setSelected] = useState<string>("");
    const [currentLocation, setCurrentLocation] = useState<string>(null)
    const [currentLocationID, setCurrentLocationID] = useState<string>(null)
    const [isDropDown, setIsDropDown] = React.useState(false);
    const [focused, setFocused] = useState<boolean>(false);

    const [locationsToSelect, setLocationsToSelect] = useState<IPrediction[]>();
    const onTypeLocation = (input: string) => {
        setIsDropDown(true)
        setLoc(input);
        setSelected("")
    };

    const handleAutoComplete = async () => {
        const locations = await autocompletePlace(debouncedValue);
        setLocationsToSelect(locations.data.predictions);
    };

    const onSelectLocation = (place_id: string, description: string) => {
        onPredictionClicked(place_id);
        setSelected(place_id);
        setLoc(description)
        setIsDropDown(false)
    };

    useEffect(() => {
        if (!debouncedValue) return;
        handleAutoComplete()
    }, [debouncedValue]);


    const getReverseGeoCoding = async () => {
        const currentLocation = await reverseGeoCoding(
            currentLocationLat,
            currentLocationLng
        );
        setCurrentLocation(currentLocation.results[0].formatted_address);
        setCurrentLocationID(currentLocation.results[0].place_id);
    };

    useEffect(() => {
        getReverseGeoCoding()
    }, [])

    const reset = () => {
        setLocationsToSelect([]);
        setLoc("")
    }

    useEffect(() => {
        if (loc === "" && currentLocationID) {
            setSelected(currentLocationID);
            onPredictionClicked(currentLocationID);
        }
    }, [loc])


    const element = <TextInput.Icon icon={locationVector} size={22} style={{margin: 0, padding: 0}}/>
    const crossElement = <TextInput.Icon icon={cross} size={10}
                                         style={{margin: 0}}
                                         onPress={reset}/>


    return (
        <Provider>
            <TextInput
                activeOutlineColor="black"
                numberOfLines={1}
                style={{overflow: 'hidden'}}
                mode="outlined"
                placeholder={focused ? "Plan a trip to..." : currentLocation}
                value={loc}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChangeText={onTypeLocation}
                left={(selected === currentLocationID || loc === "") && element}
                right={crossElement}
            />
            {isDropDown && locationsToSelect?.map((location) => (
                <List.Item
                    style={{
                        marginTop: 10,
                        borderBottomColor: 'lightgrey',
                        borderBottomWidth: hairlineWidth,
                        marginBottom: 10,
                    }}
                    key={location.place_id}
                    onPress={() => onSelectLocation(location.place_id, location.description)}
                    title={location.structured_formatting.main_text}
                />
            ))}
        </Provider>
    );
};
