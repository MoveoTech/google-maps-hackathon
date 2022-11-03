import React, { useState } from "react";

import { InfoCard } from "./InfoCard";
import { IPlace } from "../../../api/googleApi";

export function Cards(props: { topFourPlaces: IPlace[] }) {
  let { topFourPlaces } = props;

  const [currentIndexPressed, setCurrentIndexPressed] = useState(0);

  return (
    <>
      {topFourPlaces?.map((place: object, index: number) => (
        <InfoCard
          key={index}
          isPressed={currentIndexPressed === index}
          onPress={setCurrentIndexPressed}
          index={index}
          places={place}
        />
      ))}
    </>
  );
}
