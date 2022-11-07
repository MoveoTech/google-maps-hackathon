import React, { FC } from "react";
import { Text, TextStyle } from "react-native";
import { ColorValue } from "react-native";

import { PRIMARY } from "../../globalStyle";

export type TFontSize = "s" | "m" | "l" | "xl" | "xxl"; // 12px, 14px, 16px, 19px

const getFontSize: { [size in TFontSize]: number } = {
  s: 12,
  m: 14,
  l: 16,
  xl: 19,
  xxl: 32,
};

export interface ITypographyProps {
  color?: ColorValue;
  fontSize?: TFontSize;
  weight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  children: string | string[];
  fontFamily?:
    | "Avenir-regular"
    | "Avenir-light"
    | "Avenir-heavy"
    | "Avenir-book";
  style?: TextStyle;
}

const Typography: FC<ITypographyProps> = ({
  color = PRIMARY,
  fontSize = "m",
  weight = "400",
  fontFamily = "Avenir-regular",
  style,
  children,
}) => {
  return (
    <Text
      style={{
        fontFamily,
        color,
        fontSize: getFontSize[fontSize],
        fontWeight: weight,
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default Typography;
