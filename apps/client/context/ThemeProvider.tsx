'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { ThemeContext } from './theme.context';
import {
  getColors,
  getPreference,
  setPreference,
} from '../lib/utils/theme.helper';

const color = getColors();

export default function ThemeProvider({
  children,
  storageKey,
  theme: startTheme,
}: any) {
  const [theme, setTheme] = useState(startTheme ?? getPreference(storageKey));

  useEffect(() => {
    setPreference(storageKey, theme);
  }, [storageKey, theme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === color.dark ? color.light : color.dark);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, color, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
