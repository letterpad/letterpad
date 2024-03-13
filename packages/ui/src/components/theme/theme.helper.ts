import Cookie from "js-cookie";

import { THEME_STORAGE_KEY } from "./constants";

const THEME_DARK = "dark";
const THEME_LIGHT = "light";

const applyClass = (theme: string) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root) return;
  root.classList.remove(THEME_LIGHT, THEME_DARK);
  root.classList.add(theme);
  root.style.colorScheme = theme;
};

export const getTheme = (storageKey: string = THEME_STORAGE_KEY) => {
  if (typeof window === "undefined") return THEME_DARK;
  const cookie = Cookie.get(storageKey);

  if (cookie) {
    return cookie;
  }

  return window.matchMedia(`(prefers-color-scheme: ${THEME_DARK})`).matches
    ? THEME_DARK
    : THEME_LIGHT;
};

export const setTheme = (
  storageKey: string = THEME_STORAGE_KEY,
  theme: string
) => {
  applyClass(theme);
  Cookie.remove(storageKey);
  Cookie.set(storageKey, theme, { expires: 365 });
};

export const getColors = () => ({ dark: THEME_DARK, light: THEME_LIGHT });
