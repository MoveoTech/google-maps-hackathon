import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

import defaultAnimation from "../../../lotties/loader.json";

export interface ILoaderProps {
  animationData?: JSON;
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
  },
});
