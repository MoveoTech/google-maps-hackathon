import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
export const useAppStateChange = (callback: (...params: any) => void) => {
  const appState = useRef(AppState.currentState);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const _handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      callback();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      _handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  return { appStateVisible };
};
