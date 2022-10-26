import {useEffect, useState} from "react";
import {getDistanceCalculation} from "../api/api";

export const useDistanceCalculator = (
    origins: string,
    destinations: string
) => {
    const [timeToDestination, setTimeToDestination] = useState<string>();
    const [distanceTpDestination, setDistanceToDestination] = useState<string>()

    const calculateDistance = async () => {
        const timeToDestination = await getDistanceCalculation(origins, destinations);
        setTimeToDestination(JSON.stringify(timeToDestination.data.rows[0].elements[0].duration));
        setDistanceToDestination(JSON.stringify(timeToDestination.data.rows[0].elements[0].distance.text));
    };

    useEffect(() => {
        if (!origins || !destinations) return;
        calculateDistance();
    }, [origins, destinations]);

    return { timeToDestination, distanceTpDestination };
};
