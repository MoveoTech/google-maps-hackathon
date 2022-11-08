import * as React from "react";
import {Card, Button} from "react-native-paper";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {getDetails} from "../../../api/googleApi";
import {useState} from "react";
import HomePage from "../../pages/HomePage/HomePage";
import {LatLng} from "react-native-maps";

interface Props {
    next: (isLastStep: boolean) => void;
    isNextDisabled: boolean;
    skip: (isLastStep: boolean) => void;
    isLast: boolean;
    onBoarding: boolean;
    continueCallback: () => void;
}

export const StickyFooter = ({ next, isLast, skip, isNextDisabled, onBoarding, continueCallback }: Props) => {
  return(
  <Card style={{ marginTop: "auto", height: 200, justifyContent: "center" }}>
    <Card.Content style={styles.container}>
      {onBoarding ? (
          <Button
              mode="contained"
              style={styles.continue}
              onPress={continueCallback}
          >
            Continue
          </Button>
      ) : (
          <>
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
          </>
      )}
    </Card.Content>
  </Card>
  )}
;

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
    continue: {
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        width: Dimensions.get("window").width * 0.9,
        backgroundColor: "black",
    },
});
