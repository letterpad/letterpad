const bodyClassList = document.body.classList;

export const switchTheme = (callback, theme = "") => {
  const currentTheme = localStorage.theme;
  let switchToTheme =
    currentTheme === "theme-light" ? "theme-dark" : "theme-light";
  if (theme) {
    switchToTheme = theme;
  }

  bodyClassList.remove(currentTheme);
  localStorage.theme = switchToTheme;
  bodyClassList.add(switchToTheme);
  callback(switchToTheme);
};
