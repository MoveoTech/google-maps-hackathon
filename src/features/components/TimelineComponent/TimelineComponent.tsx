import React, {useEffect, useState} from "react";
import {ImageSourcePropType, StyleSheet} from "react-native";
import {GOOGLE_MAPS_APIKEY} from "@env";

import Stop from "../Stop/Stop";
import {Container, StartPoint, EndPoint} from "./styles";
import {FlexedView, MAIN} from "../../globalStyle";
import Typography from "../Typography/Typography";
import {IPlaceOnMap} from "../../pages/HomePage/HomePageMap";
import {
    openGoogleMaps,
    PhotosBaseURL,
    reverseGeoCoding,
} from "../../../api/googleApi";
import Button from "../Button/Button";
import {LatLng} from "react-native-maps";
import EmptyState from "./EmptyState";

export interface NavigationPlaces {
    destinationId: string;
    destinationName: string;
    waypointsIds: string;
    waypointsNames;
}

interface Timeline {
    startLocation: LatLng;
    tripPlaces: IPlaceOnMap[];
    initialWizard: () => void;
}

const TimelineComponent = ({
                               tripPlaces,
                               startLocation,
                               initialWizard,
                           }: Timeline) => {
    const [startingLocationAddress, setStartingLocationAddress] = useState("");

    const prepareNavigationPlaces = (): NavigationPlaces => {
        const navigationPlaces = tripPlaces.map((place) => ({
            id: place.place_id,
            name: place.name.replace(/ /g, "+"),
        }));
        const destination = navigationPlaces.pop();

        return {
            destinationId: destination?.id || "",
            destinationName: destination?.name || "",
            waypointsIds: navigationPlaces.map((place) => place.id).join("%7C"),
            waypointsNames: navigationPlaces.map((place) => place.name).join("%7C"),
        };
    };

    const {destinationId, destinationName, waypointsIds, waypointsNames} =
        prepareNavigationPlaces();

    const getReverseGeoCoding = async () => {
        const startLocationAddress = await reverseGeoCoding(
            startLocation.latitude,
            startLocation.longitude
        );
        setStartingLocationAddress(
            startLocationAddress?.results[0]?.formatted_address
        );
    };

    useEffect(() => {
        getReverseGeoCoding();
    }, []);

    if (!tripPlaces.length) return <EmptyState initialWizard={initialWizard}/>;

    return (
        <Container>
            <StartPoint
                displayLineIcon={false}
                addressName={
                    <FlexedView>
                        <Typography color={MAIN} fontFamily="Avenir-heavy">
                            Start:&nbsp;
                        </Typography>
                        <Typography fontFamily="Avenir-heavy">
                            {startingLocationAddress}
                        </Typography>
                    </FlexedView>
                }
            />
            {tripPlaces.map((stopPoint, index) => {
                const photoReference =
                    (stopPoint?.photos as any[])?.length > 0
                        ? stopPoint?.photos[0]?.photo_reference
                        : null;
                return (
                    <Stop
                        key={index}
                        image={
                            `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}` as ImageSourcePropType
                        }
                        addressName={stopPoint.name}
                        stopType={stopPoint.locationType}
                        timeAtPlace={stopPoint.timeAtPlace}
                        duration={stopPoint.direction.duration}
                        distance={stopPoint.direction.distance}
                    />
                );
            })}
            {/* <EndPoint
        addressName={
          <FlexedView>
            <Typography color={MAIN} fontFamily="Avenir-heavy">
              End:&nbsp;
            </Typography>
            <Typography fontFamily="Avenir-heavy">
              {endLocationAddress}
            </Typography>
          </FlexedView>
        }
      /> */}

            <Button
                title="Navigate with Google maps"
                buttonColor={"black"}
                mode={"contained"}
                labelStyle={{color: "white"}}
                style={styles.navigateButton}
                onPress={() =>
                    openGoogleMaps({
                        destinationId,
                        destinationName,
                        waypointsIds,
                        waypointsNames,
                    })
                }
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    navigateButton: {
        borderRadius: 10,
        alignSelf: "center",
        marginTop: 16,
        marginBottom: 48,
    },
});

export default TimelineComponent;
