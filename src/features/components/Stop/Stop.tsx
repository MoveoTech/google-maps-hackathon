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
  time?: string;
  duration?: string;
  distance?: string;
}
const Stop: FC<IStopProps> = ({
  image,
  stopType,
  addressName,
  time,
  duration,
  distance,
  displayLineIcon = true,
}) => {
  const imageToDisplay = image ? { uri: image } : locationIcon;
  console.log(typeof addressName);

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
              {duration} &#x2022;&nbsp;
            </Typography>

            <Typography fontSize="s" color={SECONDARY}>
              {distance}
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
        <Right>{time && <Time>{time}</Time>}</Right>
      </Row>
    </Container>
  );
};

export default Stop;
