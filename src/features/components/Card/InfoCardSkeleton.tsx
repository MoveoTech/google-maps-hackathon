import * as React from "react";
import { Card } from "react-native-paper";
import { Dimensions, StyleSheet, View } from "react-native";

import Typography from "../Typography/Typography";
import { PRIMARY, SECONDARY } from "../../globalStyle";
import { StarIcon, WalkIcon } from "./utils";

export const InfoCardSkeleton: React.FC = ({}) => {
  return (
    <Card style={styles.cardWrapper}>
      <Card.Cover style={{ height: 130 }} source={{}} />

      <Card.Content>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ marginTop: 10, marginRight: 2 }}>
            <StarIcon />
          </View>
          <Typography style={styles.rating}>
            ...
            <Typography style={styles.user_ratings_total}>
              &nbsp;(..) • ...
            </Typography>
          </Typography>
        </View>
      </Card.Content>
      <Card.Content>
        <Typography style={styles.header}>...</Typography>
        <Typography style={styles.description}>...</Typography>
      </Card.Content>
      <View style={styles.bottomContainer} />
      <Card.Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography style={styles.distanceDetails}>
          $$ •
          <WalkIcon />
        </Typography>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 5,
    width: Dimensions.get("window").width * 0.45,
    borderWidth: 2,
    borderColor: "transparent",
  },
  rating: {
    display: "flex",
    color: PRIMARY,
    marginTop: 10,
  },
  description: {
    fontSize: 12,
    marginTop: 5,
    display: "flex",
    color: PRIMARY,
  },
  header: {
    fontSize: 15,
    display: "flex",
    height: 20,
    overflow: "hidden",
    marginTop: 5,
  },
  bottomContainer: {
    marginTop: 10,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  distanceDetails: {
    display: "flex",
    marginTop: 5,
    color: SECONDARY,
  },
  user_ratings_total: {
    color: SECONDARY,
    fontSize: 10,
  },
});
