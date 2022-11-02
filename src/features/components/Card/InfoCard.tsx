import * as React from 'react';
import {Card} from 'react-native-paper';
import {ImageSourcePropType, StyleSheet, Text, View} from "react-native";


interface ICardComponentProps {
    isPressed: boolean,
    onPress: (number) => void,
    index: number,
    vicinity?: string,
    rating?: number,
    photo?: ImageSourcePropType,
    name?: string,
    price_level?: number,
    editorial_summary?: string
}

export const InfoCard: React.FC<ICardComponentProps> =
    ({
         isPressed,
         onPress,
         index,
         vicinity,
         rating,
         photo,
         name,
         price_level,
         editorial_summary
     }) => {

        return (
            <Card style={styles(isPressed).cardWrapper}
                  onPress={() => onPress(index)}>
                <Card.Cover source={photo}/>
                <Card.Content>
                    <Text style={styles(isPressed).rating}>{rating}</Text>
                </Card.Content>
                <Card.Content>
                    <Text style={styles(isPressed).header}>{name}</Text>
                    <Text style={styles(isPressed).description}>{editorial_summary}</Text>
                </Card.Content>
                <View style={styles(isPressed).bottomContainer}/>
                <Card.Content>
                    <Text style={styles(isPressed).distanceDetails}>{price_level} • {vicinity}</Text>
                </Card.Content>
            </Card>)
    };

const styles = (isPressed) => StyleSheet.create({
    cardWrapper: {
        margin: 5,
        width: 180,
        borderWidth: 2,
        borderColor: isPressed ? '#8755F2' : 'transparent'
    },
    rating: {
        display: 'flex',
        color: '#222222',
        marginTop: 10
    },
    description: {
        fontSize: 12,
        marginTop: 5,
        display: 'flex',
        color: '#222222'
    },
    header: {
        fontSize: 15,
        display: 'flex',
        marginTop: 5,
    },
    bottomContainer: {
        marginTop: 10,
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    distanceDetails: {
        display: 'flex',
        marginTop: 5,
        color: '#707173'
    }
});

