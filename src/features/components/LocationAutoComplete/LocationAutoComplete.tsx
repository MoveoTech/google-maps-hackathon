import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { List, Provider, TextInput } from "react-native-paper";

import {
  autocompletePlace,
  IPrediction,
  reverseGeoCoding,
} from "../../../api/googleApi";
import useDebounce from "../../hooks/useDebounce";
import hairlineWidth = StyleSheet.hairlineWidth;
import cross from "../../../../assets/cross.png";
import { DARK_NAVY } from "../../globalStyle";
import { IStartLocation } from "../../pages/HomePage/HomePageMap";

export const SetLocationIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 15 16" fill="none">
    <Path
      d="M7.7491 0.948244C6.32154 0.948244 4.92605 1.37162 3.73914 2.16483C2.55224 2.95803 1.62723 4.08542 1.08114 5.4044C0.535049 6.72338 0.392399 8.17469 0.671236 9.57475C0.950074 10.9748 1.63787 12.2607 2.64763 13.2698C3.65738 14.279 4.94374 14.9659 6.34398 15.2439C7.74422 15.5218 9.19543 15.3783 10.5141 14.8313C11.8327 14.2844 12.9595 13.3587 13.7519 12.1713C14.5444 10.9838 14.9669 9.58808 14.966 8.16052C14.966 7.213 14.7793 6.27478 14.4165 5.39944C14.0538 4.52411 13.5221 3.72883 12.8519 3.05905C12.1817 2.38926 11.3861 1.85811 10.5105 1.49593C9.63497 1.13375 8.69662 0.94764 7.7491 0.948244ZM9.09509 8.63368L6.89465 12.8784L6.64659 11.1235L6.39852 9.3687L4.63909 9.14819L2.88426 8.92769L7.10597 6.65835L11.3139 4.3936L9.09509 8.63368Z"
      fill={DARK_NAVY}
    />
  </Svg>
);
interface Props {
  onPredictionClicked: (place_id: string) => void;
  currentLocationLat?: number;
  currentLocationLng?: number;
  setStartingLocationAddress: IStartLocation;
}

export const LocationAutoComplete = ({
  onPredictionClicked,
  currentLocationLat,
  currentLocationLng,
  setStartingLocationAddress,
}: Props) => {
  const [loc, setLoc] = useState("");
  const debouncedValue = useDebounce<string>(loc, 1000);
  const [selected, setSelected] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [currentLocationID, setCurrentLocationID] = useState<string | null>(
    null
  );
  const [isDropDown, setIsDropDown] = React.useState(false);
  const [focused, setFocused] = useState<boolean>(false);

  const [locationsToSelect, setLocationsToSelect] = useState<IPrediction[]>();
  const onTypeLocation = (input: string) => {
    setIsDropDown(true);
    setLoc(input);
    setSelected("");
  };

  const handleAutoComplete = async () => {
    const locations = await autocompletePlace(debouncedValue);
    setLocationsToSelect(locations.data.predictions);
  };

  const onSelectLocation = (place_id: string, description: string) => {
    onPredictionClicked(place_id);
    setSelected(place_id);
    setLoc(description);
    setIsDropDown(false);
  };

  useEffect(() => {
    if (!debouncedValue) return;
    handleAutoComplete();
  }, [debouncedValue]);

  const getReverseGeoCoding = async () => {
    try {
      const currentLocation = await reverseGeoCoding(
        currentLocationLat,
        currentLocationLng
      );
      if (currentLocation) {
        setCurrentLocation(currentLocation.results[0].formatted_address);
        setCurrentLocationID(currentLocation.results[0].place_id);
        setStartingLocationAddress({
          id: currentLocation.results[0].place_id,
          name: currentLocation.results[0].formatted_address,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getReverseGeoCoding();
  }, []);

  const reset = () => {
    setLocationsToSelect([]);
    setLoc("");
  };

  useEffect(() => {
    if (loc === "" && currentLocationID) {
      setSelected(currentLocationID);
      onPredictionClicked(currentLocationID);
    }
  }, [loc]);

  const element = (
    <TextInput.Icon icon={SetLocationIcon} size={22} style={{}} />
  );
  const crossElement = (
    <TextInput.Icon
      icon={cross}
      size={10}
      style={{ margin: 0 }}
      onPress={reset}
    />
  );

  return (
    <Provider>
      <TextInput
        activeOutlineColor="black"
        numberOfLines={1}
        style={{ overflow: "hidden" }}
        mode="outlined"
        placeholder={focused ? "Trip to" : currentLocation}
        value={loc}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={onTypeLocation}
        left={(selected === currentLocationID || loc === "") && element}
        right={crossElement}
      />
      {isDropDown &&
        locationsToSelect?.map((location) => (
          <List.Item
            style={{
              marginTop: 10,
              borderBottomColor: "lightgrey",
              borderBottomWidth: hairlineWidth,
              marginBottom: 10,
            }}
            key={location.place_id}
            onPress={() =>
              onSelectLocation(location.place_id, location.description)
            }
            title={location.structured_formatting.main_text}
          />
        ))}
    </Provider>
  );
};
