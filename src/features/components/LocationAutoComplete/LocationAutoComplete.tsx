import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import {
  autocompletePlace,
  getDetails,
  IPrediction,
} from "../../../api/googleApi";
import useDebounce from "../../hooks/useDebounce";
import { Button, TextInput } from "react-native-paper";

interface Props {
  onPredictionClicked: (place_id: string) => void;
}

export const LocationAutoComplete = ({ onPredictionClicked }: Props) => {
  const [manualLocation, setManualLocation] = useState("");
  const debouncedValue = useDebounce<string>(manualLocation, 1000);
  const [selected, setSelected] = useState<string>("");

  const [locationsToSelect, setLocationsToSelect] = useState<IPrediction[]>();
  const onTypeLocation = (input: string) => {
    setManualLocation(input);
  };

  const handleAutoComplete = async () => {
    const locations = await autocompletePlace(debouncedValue);
    setLocationsToSelect(locations.data.predictions);
  };

  const onSelectLocation = (place_id: string) => {
    onPredictionClicked(place_id);
    setSelected(place_id);
  };
  console.log(selected);

  useEffect(() => {
    if (!debouncedValue) return;
    handleAutoComplete();
  }, [debouncedValue]);

  return (
    <View>
      <TextInput
        mode="outlined"
        label="I'd like to travel to..."
        placeholder="type location"
        value={manualLocation}
        onChangeText={onTypeLocation}
      />
      {locationsToSelect?.map((location) => (
        <Button
          labelStyle={{
            color: selected !== location.place_id ? "black" : "white",
          }}
          mode="outlined"
          style={{
            marginTop: 20,
            marginLeft: 5,
            borderRadius: 5,
            backgroundColor: selected === location.place_id ? "black" : "white",
          }}
          key={location.main_text}
          onPress={() => onSelectLocation(location.place_id)}
        >
          {location.structured_formatting.main_text}
        </Button>
      ))}
    </View>
  );
};
