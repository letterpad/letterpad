import { getCookie, setCookie, eraseCookie } from '@/lib/utils/cookie';

const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

const applyPreference = (theme) => {
  const root = document.documentElement;
  if (!root) return;
  root.classList.remove(THEME_LIGHT, THEME_DARK);
  root.classList.add(theme);
  root.style.colorScheme = theme;
};

export const getPreference = (storageKey) => {
  const cookie = getCookie(storageKey);

  if (cookie) {
    return cookie;
  }

  return window.matchMedia(`(prefers-color-scheme: ${THEME_DARK})`).matches
    ? THEME_DARK
    : THEME_LIGHT;
};

export const setPreference = (storageKey, theme) => {
  eraseCookie(storageKey);
  setCookie(storageKey, theme, 365);
  applyPreference(theme);
};

export const getColors = () => ({ dark: THEME_DARK, light: THEME_LIGHT });
