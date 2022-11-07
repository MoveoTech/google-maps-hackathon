import * as React from 'react';
import {Card, Button} from 'react-native-paper';
import {Dimensions, StyleSheet, Text, View} from "react-native";

interface Props {
    next: (isLastStep: boolean) => void;
    isLast: boolean;
    isDisabled: boolean;
}

export const StickyFooter = ({next, isLast, isDisabled}: Props) => (
    <Card style={{marginTop: 'auto', height: 180, justifyContent: 'center'}}>
        <Card.Content style={styles.container}>
            <Text style={styles.skipButton}> Skip Experience</Text>
            <Button buttonColor={'black'} mode={'contained'} labelStyle={{color: "white"}}
                    style={{width: 120, borderRadius: 10}} onPress={() => next(isLast)}
                    disabled={isDisabled}>Next</Button>
        </Card.Content>
    </Card>
);

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skipButton: {
        color: "black",
        textDecorationLine: 'underline',
        alignSelf: 'center'
    }
})

