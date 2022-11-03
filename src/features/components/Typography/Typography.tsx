import React, { FC } from "react";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { Text, TextStyle } from "react-native";
import { ColorValue } from "react-native";

import { PRIMARY } from "../../globalStyle";

export type TFontSize = "s" | "m" | "l"; // 12px, 14px, 16px

const getFontSize: { [size in TFontSize]: number } = {
  s: 12,
  m: 14,
  l: 16,
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
    | "Inter_100Thin"
    | "Inter_200ExtraLight"
    | "Inter_300Light"
    | "Inter_400Regular"
    | "Inter_500Medium"
    | "Inter_600SemiBold"
    | "Inter_700Bold"
    | "Inter_800ExtraBold"
    | "Inter_900Black";
  style?: TextStyle;
}
const Typography: FC<ITypographyProps> = ({
  color = PRIMARY,
  fontSize = "m",
  weight = "400",
  fontFamily = "Inter_400Regular",
  style,
  children,
}) => {
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) return null; //TODO: add loader

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
