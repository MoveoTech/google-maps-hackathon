import styled from "styled-components/native";

import { FlexedView } from "../../globalStyle";

export const Container = styled.View`
  width: 200;
`;
export const StopInfo = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 8;
`;
export const StopType = styled.Text`
  text-transform: capitalize;
  /* font-family: Avenir; */
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
`;
export const StopAddressName = styled.Text`
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
export const Right = styled(FlexedView)``;
export const Time = styled.Text``;
export const DurationAndDistance = styled.Text``;
export const TripInfo = styled(FlexedView)`
  justify-content: space-between;
  align-items: center;
`;
