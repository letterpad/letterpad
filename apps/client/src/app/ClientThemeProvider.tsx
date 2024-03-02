'use client';
import { getTheme, ThemeProvider } from 'ui';

export const ClientThemeProvider = ({ children }) => {
  const theme = getTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
