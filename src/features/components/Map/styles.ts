import styled from "styled-components/native";
import { Dimensions } from "react-native";

export const StyledMap = styled.MapView`
  width: ${Dimensions.get("window").width} * 0.95;
  height: ${Dimensions.get("window").height} * 0.9;
`;
