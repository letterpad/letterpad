const bodyClassList = document.body.classList;

export const switchTheme = callback => {
  const currentTheme = localStorage.theme;
  const switchToTheme =
    currentTheme === "theme-light" ? "theme-dark" : "theme-light";

  bodyClassList.remove(currentTheme);
  localStorage.theme = switchToTheme;
  bodyClassList.add(switchToTheme);
  callback(switchToTheme);
};
