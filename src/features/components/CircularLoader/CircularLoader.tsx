import React, { FC } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { MAIN } from "../../globalStyle";

export interface ICircularLoader {
  color?: string;
  size?: "small" | "large";
}
const CircularLoader: FC<ICircularLoader> = ({
  color = MAIN,
  size = "large",
}) => (
  <View style={[styles.container]}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default CircularLoader;
