import React from "react";
import { Image, View } from "react-native";
import EmptyStateImage from "../../../../assets/emptyState.png";
import Button from "../Button/Button";
import Typography from "../Typography/Typography";

const EmptyState = ({ initialWizard }) => {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography fontSize="xl" weight="600">
        We coudn't found any chosen experience!
      </Typography>
      <Typography fontSize="m" weight="500">
        Please choose at least one attraction/restaurant
      </Typography>
      <Button
        style={{ marginTop: 24, width: "50%" }}
        title="Try again"
        buttonType="secondary"
        onPress={() => initialWizard()}
      />
      <Image source={EmptyStateImage} />
    </View>
  );
};

export default EmptyState;
