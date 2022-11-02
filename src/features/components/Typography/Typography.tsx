import React, { FC } from "react";
import AppLoading from "expo-app-loading";

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

export type TFontSize = "s" | "m" | "l"; // 12px, 14px, 16px

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
  children: string;
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
  color = "black",
  fontSize = "m",
  weight = "600",
  fontFamily = "Inter_500Medium",
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

  if (!fontsLoaded) return <AppLoading />;

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

const getFontSize: { [size in TFontSize]: number } = {
  s: 12,
  m: 14,
  l: 16,
};
