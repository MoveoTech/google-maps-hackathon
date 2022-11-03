import * as React from "react";
import { Card } from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { IPlace } from "../../../api/googleApi";
import { IPlaceOnMap } from "../../pages/HomePage/HomePageMap";

export const PhotosBaseURL =
  "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400";
interface ICardComponentProps {
  isPressed: boolean;
  onPress: (number) => void;
  index: number;
  place: IPlaceOnMap;
}

export const InfoCard: React.FC<ICardComponentProps> = ({
  isPressed,
  onPress,
  index,
  place,
}) => {
  const pricing = (price_level) => {
    if (price_level > 3) return "$";
    if (price_level === 2) return "$$";
    return "$$$";
  };

  const photoReference =
    (place?.photos as any[])?.length > 0
      ? place?.photos[0]?.photo_reference
      : null;

  return (
    <Card style={styles(isPressed).cardWrapper} onPress={() => onPress(index)}>
      {photoReference ? (
        <Card.Cover
          style={{ height: 130 }}
          source={{
            uri: `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`,
          }}
        />
      ) : (
        <Text>no image</Text>
      )}
      <Card.Content>
        <Text style={styles(isPressed).rating}>{place?.rating}</Text>
      </Card.Content>
      <Card.Content>
        <Text style={styles(isPressed).header}>{place?.name}</Text>
        <Text style={styles(isPressed).description}>
          {place?.types.slice(0, 1).join(", ")}
        </Text>
      </Card.Content>
      <View style={styles(isPressed).bottomContainer} />
      <Card.Content>
        <Text style={styles(isPressed).distanceDetails}>
          {pricing(place?.price_level)} • {20}
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
