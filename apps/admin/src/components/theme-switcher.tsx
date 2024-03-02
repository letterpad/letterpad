"use client";

import { CiDark, CiLight } from "react-icons/ci";
import { getColors, useTheme } from "ui";

const { dark } = getColors();

const ThemeSwitcher = () => {
  const { toggleTheme, theme } = useTheme();
  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="p-1 dark:hover:bg-slate-400/45 hover:bg-slate-200/45 rounded-full h-10 w-10 flex justify-center items-center"
      onClick={toggleTheme}
    >
      {theme === dark ? (
        <CiLight className="h-6 w-6 md:h-7 md:w-7" />
      ) : (
        <CiDark className="h-6 w-6 md:h-7 md:w-7" />
      )}
    </button>
  );
};
export default ThemeSwitcher;
