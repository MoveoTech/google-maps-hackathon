import { Text } from "react-native";
import React, { useCallback, useState } from "react";

import { LocationAutoComplete } from "../../components/LocationAutoComplete/LocationAutoComplete";
import Map from "../../components/Map/Map";
import { useUser } from "../../contexts/UserContext";
import { HomepageContainer } from "./styles";
import { Cards } from "../../components/Card/Cards";
import { DraggableDrawer } from "../../components/DraggableDrawer";
import { IPlace } from "../../../api/googleApi";
import TimelineComponent from "../../components/TimelineComponent/TimelineComponent";

const HomePage = () => {
  const { currentLocation, errorMsg } = useUser();
  const [topFourPlaces, setTopFourPlaces] = useState<IPlace[]>(null);

  if (errorMsg) return <LocationAutoComplete />;
  if (!currentLocation) return <Text>Loading...</Text>;

  const onLocationChanged = useCallback((topFourPlaces: IPlace[]) => {
    setTopFourPlaces(topFourPlaces);
  }, []);
  return (
    <>
      <HomepageContainer>
        <Map location={currentLocation} onLocationChanged={onLocationChanged} />
      </HomepageContainer>
      <DraggableDrawer>
        <Cards topFourPlaces={topFourPlaces} />
        <TimelineComponent />
      </DraggableDrawer>
    </>
  );
};

export default HomePage;
