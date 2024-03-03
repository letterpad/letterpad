'use client';

import { FC, PropsWithChildren, useCallback, useState } from 'react';

import { THEME_STORAGE_KEY } from './constants';
import { ThemeContext } from './theme.context';
import {
  getColors,
  getTheme,
  setTheme as setThemeCookie,
} from './theme.helper';

const color = getColors();

interface Props {
  storageKey?: string;
  theme?: "light" | "dark";
}


export const ThemeProvider:FC<PropsWithChildren<Props>> = ({
  children,
  storageKey = THEME_STORAGE_KEY,
  theme: startTheme,
}: any) => {
  const [theme, setTheme] = useState(startTheme ?? getTheme(storageKey));

  const toggleTheme = useCallback(() => {
    setThemeCookie(storageKey, theme === color.dark ? color.light : color.dark);
    setTheme(theme === color.dark ? color.light : color.dark);
  }, [storageKey, theme]);

  return (
    <ThemeContext.Provider value={{ theme, color, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
