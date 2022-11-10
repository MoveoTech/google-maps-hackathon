import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import LottieView, { AnimationObject } from "lottie-react-native";

import defaultAnimation from "../../../lotties/loader.json";

export interface ILoaderProps {
  animationData?:
    | string
    | AnimationObject
    | {
        uri: string;
      };
  height?: number;
  width?: number;
}
const Loader: FC<ILoaderProps> = ({
  height = 300,
  width = 300,
  animationData = defaultAnimation,
}) => {
  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        loop
        style={{
          width,
          height,
        }}
        source={animationData}
      />
    </View>
  );
};
export default Loader;

const styles = StyleSheet.create({
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "white",
  },
});
