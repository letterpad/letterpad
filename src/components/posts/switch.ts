export const isCreativesActive = () => {
  if (typeof localStorage === "undefined") return false;
  return !!localStorage.getItem("creatives");
};
