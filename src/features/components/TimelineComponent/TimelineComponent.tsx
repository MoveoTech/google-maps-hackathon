import React from "react";
import { ImageSourcePropType, StyleSheet } from "react-native";
import { GOOGLE_MAPS_APIKEY } from "@env";

import Stop from "../Stop/Stop";
import { Container, StartPoint } from "./styles";
import { FlexedView, MAIN } from "../../globalStyle";
import Typography from "../Typography/Typography";
import { IPlaceOnMap } from "../../pages/HomePage/HomePageMap";
import { openGoogleMaps, PhotosBaseURL } from "../../../api/googleApi";
import Button from "../Button/Button";
import EmptyState from "./EmptyState";

interface Timeline {
  tripPlaces: IPlaceOnMap[];
  initialWizard: () => void;
  startingLocationAddress: { name: string; id: string };
}

const TimelineComponent = ({
  tripPlaces,
  initialWizard,
  startingLocationAddress,
}: Timeline) => {
  if (!tripPlaces.length) return <EmptyState initialWizard={initialWizard} />;
  return (
    <Container>
      <StartPoint
        displayLineIcon={false}
        addressName={
          <FlexedView>
            <Typography
              style={{ marginRight: 10 }}
              color={MAIN}
              fontFamily="Avenir-heavy"
            >
              Start:&nbsp;
            </Typography>
            <Typography fontFamily="Avenir-heavy">
              {startingLocationAddress?.name}
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
    </Container>
  );
};

export default TimelineComponent;
