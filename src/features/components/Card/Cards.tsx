import React, { useState } from "react";

import { InfoCard } from "./InfoCard";
import { IPlace } from "../../../api/googleApi";
import { IPlaceOnMap } from "../../pages/HomePage/HomePage";

export function Cards(props: { topFourPlaces: IPlaceOnMap[] }) {
  let { topFourPlaces } = props;

  const [currentIndexPressed, setCurrentIndexPressed] = useState(0);

  return (
    <>
      {topFourPlaces?.map((place, index) => (
        <InfoCard
          key={index}
          isPressed={currentIndexPressed === index}
          onPress={setCurrentIndexPressed}
          index={index}
          place={place}
        />
      ))}
    </>
  );
}
