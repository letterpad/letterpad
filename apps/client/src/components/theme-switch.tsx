'use client';

import useTheme from '../../context/theme.context';
import { CiDark, CiLight } from 'react-icons/ci';

const ThemeSwitch = () => {
  const { theme, color, setTheme } = useTheme();
  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="p-1 dark:hover:bg-slate-400/45 hover:bg-slate-200/45 rounded-full sm:ml-4 h-10 w-10 flex justify-center items-center"
      onClick={() => {
        if (color) {
          setTheme(theme === color.dark ? color.light : color.dark);
        }
      }}
    >
      {theme === 'dark' ? (
        <CiLight className="h-6 w-6 md:h-7 md:w-7" />
      ) : (
        <CiDark className="h-6 w-6 md:h-7 md:w-7" />
      )}
    </button>
  );
};

export default ThemeSwitch;
