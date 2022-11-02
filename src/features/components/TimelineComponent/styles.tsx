import styled from "styled-components/native";

import Stop from "../Stop/Stop";

export const Container = styled.View`
  margin: 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export const StartPoint = styled(Stop)`
  margin-bottom: 41%;
`;
export const EndPoint = styled(Stop)`
  margin-top: 41%;
`;
