import React, { useState, useEffect } from "react";
import { View, TextInput, Text } from "react-native";
import { autocompletePlace } from "../../../api/googleApi";
import useDebounce from "../../hooks/useDebounce";

export const LocationAutoComplete = () => {
  const [manualLocation, setManualLocation] = useState("");
  const debouncedValue = useDebounce<string>(manualLocation, 1000);

  const [selectedManualLocation, setSelectedManualLocation] = useState();
  const [locationsToSelect, setLocationsToSelect] = useState<any[]>();

  const onTypeLocation = (input: string) => {
    setManualLocation(input);
  };

  const handleAutoComplete = async () => {
    const locations = await autocompletePlace(debouncedValue);
    setLocationsToSelect(locations.data.predictions);
    console.log("locations", locations.data.predictions);
  };

  const onSelectLocation = (place_id: string) => {
    console.log("selected place is", place_id);
  };
  useEffect(() => {
    if (!debouncedValue) return;
    handleAutoComplete();
  }, [debouncedValue]);

  return (
    <View>
      <Text>select starting location:</Text>
      <TextInput
        placeholder="type location"
        value={manualLocation}
        onChangeText={onTypeLocation}
      />
      {locationsToSelect?.map((location) => (
        <Text
          style={{ color: "black" }}
          key={location.main_text}
          onPress={() => onSelectLocation(location.place_id)}
        >
          {location.structured_formatting.main_text}
        </Text>
      ))}
    </View>
  );
};
