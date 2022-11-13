import * as React from "react";
import {Card} from "react-native-paper";
import {Dimensions, StyleSheet, View} from "react-native";
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
                    style={{height: 130, borderTopRightRadius: 10, borderTopLeftRadius: 10}}
                    source={{
                        uri: `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`,
                    }}
                />
            ) : (
                <Card.Cover
                    style={{height: 130, borderTopRightRadius: 10, borderTopLeftRadius: 10}}
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
                    <View style={{marginTop: 10, marginRight: 3}}>
                        <StarIcon/>
                    </View>
                    <Typography style={styles(isPressed).rating}>
                        {place?.rating}
                        <Typography style={styles(isPressed).user_ratings_total}>
                            &nbsp;({place.user_ratings_total})
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
                    position: "relative",
                    top: 8,
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: "start",
                    alignItems: "center",
                }}
            >
                <Typography style={styles(isPressed).distanceDetails}>
                    {pricing(place?.price_level)} {""} • {""}
                </Typography>

                <WalkIcon/>
                <Typography style={styles(isPressed).distanceDetails}>
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
            maxHeight: 270,
            borderWidth: 1,
            borderColor: isPressed ? MAIN : "transparent",
            borderRadius: 10,
            elevation: 5,
            shadowOpacity: 0,
        },
        rating: {
            fontFamily: "Avenir-regular",
            fontWeight: '500',
            display: "flex",
            color: PRIMARY,
            marginTop: 10,
            fontSize: 14
        },
        description: {
            fontSize: 14,
            marginTop: 5,
            display: "flex",
            color: PRIMARY,
            fontFamily: "Avenir-regular",
            fontWeight: '400'
        },
        header: {
            fontSize: 14,
            display: "flex",
            height: 20,
            overflow: "hidden",
            marginTop: 5,
            fontFamily: 'Avenir-regular',
            fontWeight: "900"
        },
        bottomContainer: {
            marginTop: 10,
            borderBottomColor: "black",
            borderStyle: 'dashed',
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        distanceDetails: {
            display: "flex",
            color: SECONDARY,
        },
        user_ratings_total: {
            color: SECONDARY,
            fontFamily: "Avenir-regular",
            fontSize: 12
        },
    });
