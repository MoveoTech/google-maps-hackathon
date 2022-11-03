import * as React from "react";
import { Card } from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";
import { GOOGLE_MAPS_APIKEY } from "@env";

interface ICardComponentProps {
  isPressed: boolean;
  onPress: (number) => void;
  index: number;
  places: any;
}

export const InfoCard: React.FC<ICardComponentProps> = ({
  isPressed,
  onPress,
  index,
  places,
}) => {
  const pricing = (price_level) => {
    if (price_level > 3) {
      return "$";
    } else if (price_level > 1 && price_level < 3) {
      return "$$";
    } else {
      return "$$$";
    }
  };

  const PhotosBaseURL =
    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400";
  const photoReference = places?.photos[0].photo_reference;

  return (
    <Card style={styles(isPressed).cardWrapper} onPress={() => onPress(index)}>
      <Card.Cover
        style={{ height: 130 }}
        source={{
          uri: `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`,
        }}
      />
      <Card.Content>
        <Text style={styles(isPressed).rating}>{places?.rating}</Text>
      </Card.Content>
      <Card.Content>
        <Text style={styles(isPressed).header}>{places?.name}</Text>
        <Text style={styles(isPressed).description}>
          {places?.types.slice(0, 1).join(", ")}
        </Text>
      </Card.Content>
      <View style={styles(isPressed).bottomContainer} />
      <Card.Content>
        <Text style={styles(isPressed).distanceDetails}>
          {pricing(places?.price_level)} • {20}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = (isPressed) =>
  StyleSheet.create({
    cardWrapper: {
      margin: 5,
      width: 180,
      borderWidth: 2,
      borderColor: isPressed ? "#8755F2" : "transparent",
    },
    rating: {
      display: "flex",
      color: "#222222",
      marginTop: 10,
    },
    description: {
      fontSize: 12,
      marginTop: 5,
      display: "flex",
      color: "#222222",
    },
    header: {
      fontSize: 15,
      display: "flex",
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
      color: "#707173",
    },
  });
