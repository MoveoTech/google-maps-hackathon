import * as React from 'react';
import {Card} from 'react-native-paper';
import {StyleSheet, Text, View} from "react-native";

export const FoodCard = () => (
    <Card style={styles.cardWrapper}>
        <Card.Cover source={{uri: 'https://picsum.photos/700'}}/>
        <Card.Content>
            <Text style={styles.rating}>4.5 (1,649)</Text>
        </Card.Content>
        <Card.Content>
            <Text style={styles.header}>TINK Superfoods</Text>
            <Text style={styles.description}>healthy, vegan, smoothies...</Text>
        </Card.Content>
        <View style={styles.bottomContainer}/>
        <Card.Content>
            <Text style={styles.distanceDetails}>$$$ • 20-30 min</Text>
        </Card.Content>
    </Card>
);

const styles = StyleSheet.create({
    cardWrapper: {
        margin: 5,
        width: 180,
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

