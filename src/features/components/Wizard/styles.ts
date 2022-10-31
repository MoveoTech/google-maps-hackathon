import styled from "styled-components/native";
import { BLUE_COLOR, NAVY_BLUE_COLOR } from "../../globalStyle";

export const StyledButton = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 8%;
  background-color: ${NAVY_BLUE_COLOR};
  padding: 8;
  border-radius: 4;
`;

export const StyledLabel = styled.Text`
  color: ${BLUE_COLOR};
`;
