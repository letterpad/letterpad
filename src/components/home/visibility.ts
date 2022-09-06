export const setIntroDimissed = (value: boolean) => {
  console.log(value);
  localStorage.intro_dismissed = value;
};

export const isIntroDismissed = () => {
  return localStorage.getItem("intro_dismissed") === "true";
};
