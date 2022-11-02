import { Text } from "react-native";
import React from "react";

import { LocationAutoComplete } from "../../components/LocationAutoComplete/LocationAutoComplete";
import Map from "../../components/Map/Map";
import { useUser } from "../../contexts/UserContext";
import { HomepageContainer } from "./styles";
import Button from "../../components/Button/Button";

const HomePage = () => {
  const { currentLocation, errorMsg } = useUser();

  if (errorMsg) return <LocationAutoComplete />;
  if (!currentLocation) return <Text>Loading...</Text>;

  return (
    <HomepageContainer>
      <Map location={currentLocation} />
      <Button
        onPress={function (): void {
          throw new Error("Function not implemented.");
        }}
        title={"Primary button"}
      />
    </HomepageContainer>
  );
};

export default HomePage;
