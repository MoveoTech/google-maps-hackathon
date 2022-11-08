import {Text} from "react-native";
import React from "react";
import {LocationAutoComplete} from "../../components/LocationAutoComplete/LocationAutoComplete";
import {useUser} from "../../contexts/UserContext";
import {HomePageMap} from "./HomePageMap";


const HomePage = () => {
    const {currentLocation, errorMsg} = useUser();


    if (errorMsg) return <LocationAutoComplete/>;
    if (!currentLocation) return <Text>Loading...</Text>;

    return <HomePageMap locationCoords={currentLocation}/>;
};

export default HomePage;
