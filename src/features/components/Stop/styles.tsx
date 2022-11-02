import { Dimensions } from "react-native";
import styled from "styled-components/native";

import { FlexedView, MAIN } from "../../globalStyle";
import Typography from "../Typography/Typography";

export const Container = styled.View`
  width: ${Dimensions.get("window").width - 135};
`;
export const StopInfo = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 8;
`;
export const StopType = styled(Typography)`
  text-transform: capitalize;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
`;
export const StopAddressName = styled(Typography)`
  text-transform: capitalize;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
`;

export const Row = styled(FlexedView)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
export const Left = styled(FlexedView)`
  align-items: center;
`;
export const Right = styled(FlexedView)`
  width: 90px;
  display: flex;
  justify-content: flex-end;
`;
export const Time = styled(Typography)``;

export const DurationAndDistance = styled(Typography)``;
// export const CapitalizedText = styled(Typography).attrs<ITypographyProps>(
//   () => ({
//     fontWeight: "900",
//     fontSize: 12,
//     color: "pink",
//     style: { "text-transform": "capitalize" },
//   })
// )``;

export const TripInfo = styled(FlexedView)`
  width: 215px;
  justify-content: space-between;
  align-items: center;
`;

export const LocationImage = styled.Image`
  border-color: ${MAIN};
  border-width: 1px;
  border-radius: 100px;
  height: 40px;
  width: 40px;
  border-style: dashed;
`;
