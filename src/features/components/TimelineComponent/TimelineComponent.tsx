import React, {useEffect, useState} from "react";
import {ImageSourcePropType} from "react-native";
import {GOOGLE_MAPS_APIKEY} from "@env";

import Stop from "../Stop/Stop";
import {Container, StartPoint, EndPoint} from "./styles";
import {FlexedView, MAIN} from "../../globalStyle";
import Typography from "../Typography/Typography";
import {IPlaceOnMap} from "../../pages/HomePage/HomePageMap";
import {
    PhotosBaseURL,
    reverseGeoCoding,
} from "../../../api/googleApi";
import {LatLng} from "react-native-maps";
import EmptyState from "./EmptyState";

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
                        <Typography style={{marginRight: 10}} color={MAIN} fontFamily="Avenir-heavy">
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

        </Container>
    );
};


export default TimelineComponent;
