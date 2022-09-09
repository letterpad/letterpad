export const setIntroDimissed = (value: boolean) => {
  localStorage.intro_dismissed = value;
};

export const isIntroDismissed = () => {
  return localStorage.getItem("intro_dismissed") === "true";
};
