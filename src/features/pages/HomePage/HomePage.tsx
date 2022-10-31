import {Text} from "react-native";
import React from "react";

import {LocationAutoComplete} from "../../components/LocationAutoComplete/LocationAutoComplete";
import Map from "../../components/Map/Map";
import {useUser} from "../../contexts/UserContext";
import {HomepageContainer} from "./styles";

const HomePage = () => {
    const {currentLocation, errorMsg} = useUser();

    if (errorMsg) return <LocationAutoComplete/>;
    if (!currentLocation) return <Text>Loading...</Text>;

    return (
        <HomepageContainer>
            <Map location={currentLocation}/>
        </HomepageContainer>
    );
};

export default HomePage;
