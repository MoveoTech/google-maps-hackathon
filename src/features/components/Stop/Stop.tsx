import React, { FC, ReactNode } from "react";
import { Image, ImageSourcePropType } from "react-native";
import { capitalize } from "lodash";

import locationIcon from "../../../icons/location.png";
import walkIcon from "../../../icons/walk.png";
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

//TODO: pass the place object and then spread here
export interface IStopProps {
  addressName: string | ReactNode;
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
  const imageToDisplay = image ? { uri: image } : locationIcon;

  return (
    <Container>
      {displayLineIcon && (
        <TripInfo>
          <Image
            source={walkIcon}
            style={{ width: 16, height: 48, marginLeft: 11.5 }}
          />
          <DurationAndDistance>
            <Typography
              fontSize="s"
              color={SECONDARY}
              style={{
                textTransform: "capitalize",
              }}
            >
              {Math.round(duration) + " Min"} &#x2022;&nbsp;
            </Typography>

            <Typography fontSize="s" color={SECONDARY}>
              {parseFloat(distance + "").toFixed(2) + " mi"}
            </Typography>
          </DurationAndDistance>
        </TripInfo>
      )}
      <Row>
        <Left>
          <LocationImage source={imageToDisplay} />
          <StopInfo>
            {stopType && (
              <StopType fontSize="s" ellipsizeMode="tail" numberOfLines={1}>
                {capitalize(stopType)}
              </StopType>
            )}
            {typeof addressName === "string" ? (
              <StopAddressName llipsizeMode="tail" numberOfLines={1}>
                {capitalize(addressName)}
              </StopAddressName>
            ) : (
              <FlexedView>{addressName}</FlexedView>
            )}
          </StopInfo>
        </Left>
        <Right>{timeAtPlace && <Time>{timeAtPlace}</Time>}</Right>
      </Row>
    </Container>
  );
};

export default Stop;
