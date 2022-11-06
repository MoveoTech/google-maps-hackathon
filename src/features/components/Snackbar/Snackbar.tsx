import * as React from "react";
import {View, StyleSheet, Dimensions, Text} from "react-native";
import {Snackbar as SnackbarPaper} from "react-native-paper";
import Svg, {Path} from "react-native-svg";
import Typography from "../Typography/Typography";

type ISnackbarProps = {
    visible?: boolean;
    label?: string;
    isCheckIcon?: boolean;
    hide: () => void;
};

const Snackbar = ({visible, label, isCheckIcon, hide}: ISnackbarProps) => (
    <View style={styles.container}>
        <SnackbarPaper
            visible={visible}
            duration={800}
            onDismiss={hide}
            style={styles.snackbar}
        >
            <View style={styles.snackbarViewContainer}>
                {isCheckIcon && <CheckSvgCmp/>}
                <Typography style={styles.SnackbarLabel}>{label}</Typography>
            </View>
        </SnackbarPaper>
    </View>
);

const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: Dimensions.get("window").width * 0.8,
        flex: 1,
        marginBottom: 10,
    },
    snackbar: {
        borderRadius: 22,
        display: "flex",
        alignContent: "center",
    },
    snackbarViewContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
    },
    SnackbarLabel: {
        color: "white",
        marginLeft: 4,
        fontSize: 14,
        fontFamily: "Avenir-heavy",
    },
});

//TODO: find better way to work with svg
const CheckSvgCmp = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.8967 7.29289C19.2872 7.68342 19.2872 8.31658 18.8967 8.70711L10.7559 16.8532C10.5662 17.043 10.3081 17.1485 10.0398 17.1461C9.7714 17.1437 9.51529 17.0335 9.32901 16.8403L5.48234 12.8883C5.09896 12.4908 5.11044 11.8577 5.50798 11.4744C5.90552 11.091 6.53858 11.1025 6.92196 11.5L10.0618 14.719L17.4825 7.29289C17.873 6.90237 18.5062 6.90237 18.8967 7.29289Z"
            fill="#32c837"
        />
    </Svg>
);

export default Snackbar;
