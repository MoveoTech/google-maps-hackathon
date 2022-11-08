export const cleanText = (text: string) => {
  return text.split("-").join(" ").split("_").join(" ");
};
