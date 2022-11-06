import React from "react";
import { ImageSourcePropType } from "react-native";
import { GOOGLE_MAPS_APIKEY } from "@env";

import Stop from "../Stop/Stop";
import { Container, StartPoint, EndPoint } from "./styles";
import { FlexedView, MAIN } from "../../globalStyle";
import Typography from "../Typography/Typography";
import { IPlaceOnMap } from "../../pages/HomePage/HomePageMap";
import { PhotosBaseURL } from "../Card/InfoCard";

interface Timeline {
  tripPlaces: IPlaceOnMap[];
}
const TimelineComponent = ({ tripPlaces }: Timeline) => {
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
              {/* destination location */}
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
      <EndPoint
        addressName={
          <FlexedView>
            <Typography color={MAIN} fontFamily="Avenir-heavy">
              End:&nbsp;
            </Typography>
            <Typography fontFamily="Avenir-heavy">
              {/*origin location */}
            </Typography>
          </FlexedView>
        }
      />
    </Container>
  );
};

export default TimelineComponent;
