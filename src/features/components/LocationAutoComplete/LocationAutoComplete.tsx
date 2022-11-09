import React, {useState, useEffect} from "react";
import {View} from "react-native";
import {
    autocompletePlace,
    IPrediction, reverseGeoCoding,
} from "../../../api/googleApi";
import useDebounce from "../../hooks/useDebounce";
import {Button, Menu, MenuItemProps, Provider, TextInput} from "react-native-paper";
import {Autocomplete, AutocompleteScrollView} from "react-native-paper-autocomplete";

interface Props {
    onPredictionClicked: (place_id: string) => void;
    currentLocationLat: number;
    currentLocationLng: number
}

export const LocationAutoComplete = ({onPredictionClicked, currentLocationLat, currentLocationLng}: Props) => {
    const [manualLocation, setManualLocation] = useState("");
    const debouncedValue = useDebounce<string>(manualLocation, 1000);
    const [selected, setSelected] = useState<string>("");
    const [currentLocation, setCurrentLocation] = useState<string>("")
    const [isDropDownItemSelected, setIsDropDownItemSelected] = React.useState(false);
    const [newName, setNewName] = useState<string>("")

    const [locationsToSelect, setLocationsToSelect] = useState<IPrediction[]>();
    const onTypeLocation = (input: string) => {
        setIsDropDownItemSelected(true)
        setManualLocation(input);
        setSelected("")
    };

    const handleAutoComplete = async () => {
        const locations = await autocompletePlace(debouncedValue);
        setLocationsToSelect(locations.data.predictions);
    };

    const onSelectLocation = (place_id: string, description: string) => {
        onPredictionClicked(place_id);
        setSelected(place_id);
        setNewName(description)
        setIsDropDownItemSelected(false)
    };

    useEffect(() => {
        if (!debouncedValue) return;
        handleAutoComplete();
    }, [debouncedValue]);


    const getReverseGeoCoding = async () => {
        const currentLocation = await reverseGeoCoding(
            currentLocationLat,
            currentLocationLng
        );
        setCurrentLocation(currentLocation.results[0].formatted_address)
    };

    useEffect(() => {
        getReverseGeoCoding()
    }, [])

    const getLabel = () => {
        if (!selected) {
            return currentLocation
        } else {
            return newName
        }
    }

    return (
        <Provider>
            <TextInput
                mode="outlined"
                label={currentLocation}
                placeholder={"Plan a trip to..."}
                value={selected ? newName : manualLocation}
                onChangeText={onTypeLocation}
            />
            {isDropDownItemSelected && locationsToSelect?.map((location) => (
                <Menu.Item
                    key={location.main_text}
                    onPress={() => onSelectLocation(location.place_id, location.description)}
                    title={location.structured_formatting.main_text}
                />
            ))}
        </Provider>
    );
};
