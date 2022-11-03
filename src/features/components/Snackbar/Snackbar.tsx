import * as React from "react";
import { View, StyleSheet, Dimensions, Text, Image } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import Icon from "react-native-paper/lib/typescript/components/Icon";

const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Button onPress={onToggleSnackBar}>{visible ? "Hide" : "Show"}</Button>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "",
          onPress: () => {
            // Do something
          },
        }}
        style={styles.snackbar}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {/* <Image source={checkSvg} /> */}
          You've added it to your trip
        </Text>
        {/* <Image source={{ uri: checkSvg }} /> */}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: Dimensions.get("window").width * 0.7,
    flex: 1,
    justifyContent: "space-between",
  },
  snackbar: {
    borderRadius: 22,
    // display: "flex",
    // justifyContent: "center",
    // // width: "50%",
  },
});

export default MyComponent;
