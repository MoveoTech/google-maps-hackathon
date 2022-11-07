import * as React from "react";
import { Card, Button } from "react-native-paper";
import { StyleSheet, Text } from "react-native";

interface Props {
  next: (isLastStep: boolean) => void;
  isNextDisabled: boolean;
  skip: (isLastStep: boolean) => void;
  isLast: boolean;
}

export const StickyFooter = ({ next, isLast, skip, isNextDisabled }: Props) => (
  <Card style={{ marginTop: "auto", height: 100, justifyContent: "center" }}>
    <Card.Content style={styles.container}>
      <Text style={styles.skipButton} onPress={() => skip(isLast)}>
        Skip Experience
      </Text>
      <Button
        disabled={isNextDisabled}
        buttonColor={"black"}
        mode={"contained"}
        labelStyle={{ color: "white" }}
        style={{ width: 120, borderRadius: 10 }}
        onPress={() => next(isLast)}
      >
        Next
      </Button>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skipButton: {
    color: "black",
    textDecorationLine: "underline",
    alignSelf: "center",
  },
});
