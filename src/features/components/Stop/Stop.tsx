import React, { FC, ReactNode } from "react";
import { Image, ImageSourcePropType } from "react-native";

import locationIcon from "../../../icons/location.png";
import walkIcon from "../../../icons/walk.png";
import { FlexedView } from "../../globalStyle";

import { GoogleMapsPlaces } from "../../types";
import {
  Container,
  DurationAndDistance,
  Left,
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
            style={{ width: 16, height: 48, marginLeft: 10 }}
          />
          <DurationAndDistance
            style={{ fontWeight: "400", fontSize: 12, lineHeight: 18 }}
          >
            {duration} - {distance}
          </DurationAndDistance>
        </TripInfo>
      )}
      <Row>
        <Left>
          <Image
            source={imageToDisplay}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />
          <StopInfo>
            {stopType && (
              <StopType ellipsizeMode="tail" numberOfLines={1}>
                {stopType}
              </StopType>
            )}
            {typeof addressName === "string" ? (
              <StopAddressName llipsizeMode="tail" numberOfLines={1}>
                {addressName}
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
