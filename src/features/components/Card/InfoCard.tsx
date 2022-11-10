import * as React from "react";
import {Card} from "react-native-paper";
import {Dimensions, Image, StyleSheet, View} from "react-native";
import {GOOGLE_MAPS_APIKEY} from "@env";
import {IPlaceOnMap} from "../../pages/HomePage/HomePageMap";
import Typography from "../Typography/Typography";
import {MAIN, PRIMARY, SECONDARY} from "../../globalStyle";
import {cleanText} from "../../utils";
import {pricing, StarIcon, WalkIcon} from "./utils";
import {PhotosBaseURL} from "../../../api/googleApi";

interface ICardComponentProps {
    isPressed: boolean;
    onPress: (arg0: number) => void;
    index: number;
    place: IPlaceOnMap;
}

export const InfoCard: React.FC<ICardComponentProps> = ({
                                                            isPressed,
                                                            onPress,
                                                            index,
                                                            place,
                                                        }) => {
    const photoReference = place?.photos?.[0]?.photo_reference || null;

    const duration = place?.direction?.duration || 0;

    return (
        <Card style={styles(isPressed).cardWrapper} onPress={() => onPress(index)}>
            {photoReference ? (
                <Card.Cover
                    style={{height: 130}}
                    source={{
                        uri: `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`,
                    }}
                />
            ) : (
                <Card.Cover
                    style={{height: 130}}
                    source={require("../../../../assets/default.png")}
                />
            )}
            <Card.Content>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <View style={{marginTop: 10, marginRight: 2}}>
                        <StarIcon/>
                    </View>
                    <Typography style={styles(isPressed).rating}>
                        {place?.rating}
                        <Typography style={styles(isPressed).user_ratings_total}>
                            &nbsp;({place.user_ratings_total}) •{" "}
                            {cleanText(place.locationType)}
                        </Typography>
                    </Typography>
                </View>
            </Card.Content>
            <Card.Content>
                <Typography style={styles(isPressed).header} numberOfLines={1}>
                    {place?.name}
                </Typography>
                <Typography style={styles(isPressed).description}>
                    {cleanText(place?.types.slice(0, 1).join(", "))}
                </Typography>
            </Card.Content>
            <View style={styles(isPressed).bottomContainer}/>
            <Card.Content
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography style={styles(isPressed).distanceDetails}>
                    {pricing(place?.price_level)} •
                    <WalkIcon/>
                    {duration <= 10 ? Math.round(duration) : Math.round(duration - 4.99)}-
                    {Math.round(duration + 4.99)} min
                </Typography>
            </Card.Content>
        </Card>
    );
};

const styles = (isPressed: boolean) =>
    StyleSheet.create({
        cardWrapper: {
            margin: 5,
            width: Dimensions.get("window").width * 0.45,
            borderWidth: 1,
            borderColor: isPressed ? MAIN : "transparent",
            borderRadius: 7,
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
