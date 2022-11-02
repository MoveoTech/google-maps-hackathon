import * as React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton, TouchableRipple } from "react-native-paper";
import { ButtonType } from "../../types";

const getButtonMode = (buttonType: ButtonType) => {
  return buttonType === "secondary" ? "outlined" : "contained";
};

const getLabelText = (isDisabled: Boolean, buttonType: ButtonType) => {
  if (isDisabled || buttonType === "primary") return "white";
  if (buttonType === "secondary") return "#000000";
};

const getBackgroundColor = (isDisabled: Boolean, buttonType: ButtonType) => {
  if (isDisabled) return "#DDDDDD";
  return buttonType === "secondary" ? "transparent" : "#000000";
};

interface IButtonProps {
  onPress: () => void;
  title: string;
  isDisabled?: boolean;
  buttonType?: ButtonType;
  isSearchButton?: Boolean;
  iconName?: string;
  color?: string;
}

const Button = ({
  onPress,
  title,
  isDisabled = false,
  buttonType = "primary",
  isSearchButton = false,
  iconName,
}: IButtonProps) => (
  <TouchableRipple rippleColor="red">
    <PaperButton
      icon={(isSearchButton && "magnify") || iconName || undefined}
      uppercase={false}
      color={getBackgroundColor(isDisabled, buttonType)}
      mode={getButtonMode(buttonType)}
      labelStyle={styles(isDisabled, buttonType).labelStyle}
      style={styles(isDisabled, buttonType).buttonStyle}
      disabled={isDisabled}
      onPress={onPress}
    >
      {title}
    </PaperButton>
  </TouchableRipple>
);

const styles = (isDisabled: boolean, buttonType: ButtonType) =>
  StyleSheet.create({
    buttonStyle: {
      backgroundColor: getBackgroundColor(isDisabled, buttonType),
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      borderColor: isDisabled ? "#DDDDDD" : "#000000",
      borderWidth: 2,
      height: 44,
      width: "100%", //wrap the button in <View/> with specific width, to extend the button to this width
    },
    labelStyle: {
      color: getLabelText(isDisabled, buttonType),
      fontSize: 14,
    },
  });

export default Button;
