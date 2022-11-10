import { Dimensions } from "react-native";
import styled from "styled-components/native";

// Colors
export const BACKGROUND_COLOR = "#78b9e4";
export const BLUE_COLOR = "#fff";
export const NAVY_BLUE_COLOR = "#3367df";
export const GRAY_LIGHT = "#717171";
export const DARK_NAVY = "#201A32";

export const PRIMARY = "#222222";
export const SECONDARY = "#707173";
export const TERTIARY = "#EBFAF8";
// export const MAIN = "#0AC2A1";
export const MAIN = "#FF8811";
export const AppContainer = styled.View`
  flex: 1;
  background-color: ${MAIN};
  align-items: center;
  justify-content: center;
  height: ${Dimensions.get("window").height}px;
  width: ${Dimensions.get("window").width}px;
`;

export const FlexedView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
