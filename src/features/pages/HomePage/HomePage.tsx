import { Text } from "react-native";
import React, { useState } from "react";
import { LocationAutoComplete } from "../../components/LocationAutoComplete/LocationAutoComplete";
import Map, { IDirections, IMarker } from "../../components/Map/Map";
import { useUser } from "../../contexts/UserContext";
import { HomepageContainer } from "./styles";
import { IPlace } from "../../../api/googleApi";
import { Cards } from "../../components/Card/Cards";
import { DraggableDrawer } from "../../components/DraggableDrawer";
import TimelineComponent from "../../components/TimelineComponent/TimelineComponent";

export interface IPlaceOnMap extends IPlace {
  marker: IMarker;
  direction: IDirections;
  isSelected: boolean;
}

const HomePage = () => {
  const { currentLocation, errorMsg } = useUser();
  const [topFourPlaces, setTopFourPlaces] = useState<IPlaceOnMap[]>(null);

  if (errorMsg) return <LocationAutoComplete />;
  if (!currentLocation) return <Text>Loading...</Text>;

  return (
    <>
      <HomepageContainer>
        <Map
          location={currentLocation}
          topFourPlaces={topFourPlaces}
          setTopFourPlaces={setTopFourPlaces}
        />
      </HomepageContainer>
      <DraggableDrawer>
        <Cards topFourPlaces={topFourPlaces} />
        <TimelineComponent />
      </DraggableDrawer>
    </>
  );
};

export default HomePage;
