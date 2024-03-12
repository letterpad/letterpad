'use client';
import { ThemeProvider } from 'ui';

export const ClientThemeProvider = ({ theme, children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
