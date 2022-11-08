import { useState } from "react";

export const useShowMore = (fullText: string, limit = 25) => {
  const [isFullyShown, setIsFullyShown] = useState(false);

  const showMore = () => setIsFullyShown(true);
  const showLess = () => setIsFullyShown(false);
  const toggleShowMoreOrLess = () => setIsFullyShown((prevState) => !prevState);

  const text =
    isFullyShown || fullText.length < limit
      ? fullText
      : fullText.substring(0, limit) + "...";

  return {
    showMore,
    showLess,
    toggleShowMoreOrLess,
    isFullyShown,
    text,
  };
};
