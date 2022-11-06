import * as React from 'react';
import {Card, Button} from 'react-native-paper';
import {StyleSheet, Text} from "react-native";

interface Props {
    next: () => void
}

export const StickyFooter = ({next}: Props) => (
    <Card style={{marginTop: 'auto', height: 100, justifyContent: 'center'}}>
        <Card.Content style={styles.container}>
            <Text style={styles.skipButton}> Skip Experience</Text>
            <Button buttonColor={'black'} mode={'contained'} labelStyle={{color: "white"}}
                    style={{width: 120, borderRadius: 10}} onPress={next}>Next</Button>
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

