import React, { FC, ReactNode } from "react";
import { Image, ImageSourcePropType, View } from "react-native";
import { capitalize } from "lodash";

import { FlexedView, SECONDARY } from "../../globalStyle";
import { GoogleMapsPlaces } from "../../types";
import Typography from "../Typography/Typography";
import {
  Container,
  DurationAndDistance,
  Left,
  LocationImage,
  Right,
  Row,
  StopAddressName,
  StopInfo,
  StopType,
  Time,
  TripInfo,
} from "./styles";
import { getDistance, LocationDefaultImage, WalkLineIcon } from "./utils";
import { cleanText } from "../../utils";
import { useShowMore } from "../../hooks/useShowMore";

//TODO: pass the place object and then spread here
export interface IStopProps {
  addressName: ReactNode;
  image?: ImageSourcePropType;
  stopType?: GoogleMapsPlaces;
  displayLineIcon?: boolean;
  timeAtPlace?: number;
  duration?: number;
  distance?: number;
}
const Stop: FC<IStopProps> = ({
  image,
  stopType,
  addressName,
  timeAtPlace,
  duration,
  distance,
  displayLineIcon = true,
}) => {
  const isAddressIsString = typeof addressName === "string";
  const addressNameByType: string = isAddressIsString ? addressName : "";
  const { text: slicedAddressName } = useShowMore(
    capitalize(addressNameByType)
  );

  return (
    <Container>
      {displayLineIcon && (
        <TripInfo>
          <View style={{ marginLeft: 7.5 }}>
            <WalkLineIcon />
          </View>
          <DurationAndDistance>
            <Typography
              fontSize="s"
              color={SECONDARY}
              style={{
                textTransform: "capitalize",
              }}
            >
              {Math.round(duration || 0) + " Min"} &#x2022;&nbsp;
            </Typography>

            <Typography fontSize="s" color={SECONDARY}>
              {getDistance(distance || 0)}
            </Typography>
          </DurationAndDistance>
        </TripInfo>
      )}
      <Row>
        <Left>
          {image ? (
            <LocationImage source={{ uri: image }} />
          ) : (
            <LocationDefaultImage />
          )}
          <StopInfo>
            {stopType && (
              <StopType fontSize="s" ellipsizeMode="tail" numberOfLines={1}>
                {cleanText(capitalize(stopType))}
              </StopType>
            )}
            {isAddressIsString ? (
              <StopAddressName llipsizeMode="tail" numberOfLines={1}>
                {slicedAddressName}
                {/* {addressName} */}
              </StopAddressName>
            ) : (
              <FlexedView>{addressName}</FlexedView>
            )}
          </StopInfo>
        </Left>
        <Right>{timeAtPlace && <Time>Avg. {timeAtPlace} hours</Time>}</Right>
      </Row>
    </Container>
  );
};

export default Stop;
