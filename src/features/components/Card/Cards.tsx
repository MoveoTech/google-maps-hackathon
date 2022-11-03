import React, { useState } from "react";

import { InfoCard } from "./InfoCard";
import { IPlace } from "../../../api/googleApi";
import { IPlaceOnMap } from "../../pages/HomePage/HomePageMap";

interface Props {
  topFourPlaces: IPlaceOnMap[];
  onCardSelect: (place_id: string) => void;
}

export function Cards({ topFourPlaces, onCardSelect }: Props) {
  return (
    <>
      {topFourPlaces?.map((place, index) => (
        <InfoCard
          key={index}
          isPressed={place.isSelected}
          onPress={() => onCardSelect(place.place_id)}
          index={index}
          place={place}
        />
      ))}
    </>
  );
}
