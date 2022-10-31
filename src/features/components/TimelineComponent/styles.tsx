import styled from "styled-components/native";
import Stop from "../Stop/Stop";

export const Container = styled.View`
  margin: 24px;
  margin-bottom: 24px;
  margin-left: 24px;
  margin-right: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const StartPoint = styled(Stop)`
  margin-bottom: 41%;
`;
export const EndPoint = styled(Stop)`
  margin-top: 41%;
`;
