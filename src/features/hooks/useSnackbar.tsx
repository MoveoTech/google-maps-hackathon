import { useState } from "react";

interface Snackbar {
  isVisible: boolean;
  title: string;
  isCheckIcon: boolean;
}

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<Snackbar>({
    isVisible: false,
    title: "",
    isCheckIcon: false,
  });

  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };
  const openSnackbar = ({
    title,
    isCheckIcon,
  }: Pick<Snackbar, "title" | "isCheckIcon">) => {
    setSnackbar((prev) => ({
      title,
      isCheckIcon,
      isVisible: true,
    }));
  };

  return { openSnackbar, hideSnackbar, snackbar };
};
