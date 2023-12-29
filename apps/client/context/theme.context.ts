import { createContext, useContext } from 'react';

interface Props {
  theme?: string;
  color?: { dark: string; light: string };
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext({
  theme: undefined,
  color: undefined,
  setTheme: () => {},
  toggleTheme: () => {},
} as Props);

export default function useTheme() {
  return useContext(ThemeContext);
}
