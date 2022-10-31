import { Dimensions } from "react-native";

import styled from "styled-components/native";

export const BACKGROUND_COLOR = "#78b9e4";
export const BLUE_COLOR = "#fff";
export const NAVY_BLUE_COLOR = "#3367df";

export const MAIN = "#0AC2A1";

export const AppContainer = styled.View`
  flex: 1;
  background-color: ${MAIN};
  align-items: center;
  justify-content: center;
  height: ${Dimensions.get("window").height};
  width: ${Dimensions.get("window").width};
`;

export const FlexedView = styled.View`
  display: flex;
  flex-direction: row;
`;
