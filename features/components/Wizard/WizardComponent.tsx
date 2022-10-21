import React, { FC, useRef, useState } from "react";
// import Wizard
import Wizard from "react-native-wizard";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "@react-native-material/core";

// Import your own step components
// import Step1 from "./yourStepsDir/Step1";
// import Step2 from "./yourStepsDir/Step2";
// import Step3 from "./yourStepsDir/Step3";

// ...
const WizardComponent: FC = () => {
  const wizard = useRef<any>();
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [isLastStep, setIsLastStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [location, setLocation] = useState("");

  const stepList = [
    {
      content: <Text>Step 1</Text>,
    },
    {
      content: <Text>Step 2</Text>,
    },
    {
      content: <Text>Step 3</Text>,
    },
  ];
  return (
    <View>
      {/* <SafeAreaView style={{ backgroundColor: "yellow" }}> */}
      <View
        style={{
          display: "flex",
          height: "90%",
          // justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#FFF",
          borderRadius: 8,
        }}
      >
        <Text style={{ width: "100%", padding: 8, backgroundColor: "#66ad48" }}>
          {currentStep + 1}. Step
        </Text>
        {/* <View
          style={{
            width: "100%",
            backgroundColor: "#9deb54",
            height: 100,
            padding: 8,
            margin: 8,
          }}
        > */}
        <TextInput
          label="What is the start location?"
          value={location}
          onChangeText={(location) => setLocation(location)}
          style={{
            width: "100%",
            backgroundColor: "#ebaf54",
            height: "20%",
            padding: 8,

            // margin: 8,
          }}
        />
        {/* </View> */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            height: "95%",
            width: "100%",
            padding: 8,
            alignItems: "flex-end",
            backgroundColor: "#eac67d",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            disabled={isFirstStep}
            style={styles.button}
            onPress={() => wizard.current.prev()}
          >
            <Text style={styles.label}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLastStep}
            style={styles.button}
            onPress={() => wizard.current.next()}
          >
            <Text style={styles.label}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </SafeAreaView> */}
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#9ac6ed",
        }}
      >
        <Wizard
          ref={wizard}
          steps={stepList}
          isFirstStep={(val) => setIsFirstStep(val)}
          isLastStep={(val) => setIsLastStep(val)}
          onNext={() => {
            console.log("Next Step Called");
          }}
          onPrev={() => {
            console.log("Previous Step Called");
          }}
          currentStep={({ currentStep, isLastStep, isFirstStep }) => {
            setCurrentStep(currentStep);
          }}
        />
        <View style={{ flexDirection: "row", margin: 18 }}>
          {stepList.map((val, index) => (
            <View
              key={"step-indicator-" + index}
              style={{
                width: 10,
                marginHorizontal: 6,
                height: 10,
                borderRadius: 5,
                backgroundColor: index === currentStep ? "#fc0" : "#000",
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default WizardComponent;

const styles = StyleSheet.create({
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "8%",
    width: 130,

    backgroundColor: "#3367df",
    padding: 8,
    borderRadius: 4,
  },
  label: {
    color: "#FFF",
  },
});
