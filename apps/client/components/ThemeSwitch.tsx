'use client';

import useTheme from '../context/theme.context';
import { CiDark, CiLight } from 'react-icons/ci';

const ThemeSwitch = () => {
  const { theme, color, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="ml-1 mr-1 h-8 w-8 rounded p-1 sm:ml-4"
      onClick={() => {
        if (color) {
          setTheme(theme === color.dark ? color.light : color.dark);
        }
      }}
    >
      {theme === 'dark' ? <CiLight size={20} /> : <CiDark size={20} />}
    </button>
  );
};

export default ThemeSwitch;
