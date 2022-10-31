import { useEffect, useState } from "react";
import { getDistanceCalculation } from "../../api/googleApi";

export const useDistanceCalculator = (
  origins_id: string,
  destinations_id: string
) => {
  const [timeToDestination, setTimeToDestination] = useState<string>();
  const [distanceToDestination, setDistanceToDestination] = useState<string>();

  const calculateDistance = async () => {
    try {
      const timeToDestination = await getDistanceCalculation(
        origins_id,
        destinations_id
      );
      setTimeToDestination(
        JSON.stringify(timeToDestination.data.rows[0].elements[0].duration)
      );
      setDistanceToDestination(
        JSON.stringify(timeToDestination.data.rows[0].elements[0].distance.text)
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!origins_id || !destinations_id) return;
    calculateDistance();
  }, [origins_id, destinations_id]);

  return { timeToDestination, distanceToDestination };
};
