'use client';
import { ThemeProvider } from 'ui/dist/index.mjs';

export const ClientThemeProvider = ({ theme, children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
