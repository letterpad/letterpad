import { EventAction, track } from "@/track";
import { basePath } from "next.config";

import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(localStorage.theme || "dark");

  useEffect(() => {
    if (localStorage.theme) {
      setTheme(localStorage.theme);
    }
    setTimeout(() => {
      switchTheme(localStorage.theme || theme);
    }, 0);
  }, []);

  const switchTheme = (color: string) => {
    ThemeSwitcher.switch(color);
    setTheme(color);
    track({
      eventAction: EventAction.Click,
      eventCategory: "toggle",
      eventLabel: `theme.switcher - ${color}`,
    });
  };

  return (
    <>
      <div className="container">
        <div
          className="button"
          onClick={() => switchTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "light" ? <Icon dark /> : <Icon />}
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
        }
        .button {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

ThemeSwitcher.switch = (color = "dark") => {
  const $body = document.body;
  let stylePath = "/css/antd.css";
  document.getElementsByTagName("html")[0].classList.add("no-transitions");
  if (color === "dark") {
    stylePath = "/css/antd.dark.css";
    $body.classList.remove("light");
    $body.classList.add("dark");
  } else {
    $body.classList.remove("dark");
    $body.classList.add("light");
  }
  document.getElementsByTagName("html")[0].classList.remove("no-transitions");
  const $style = document.querySelector("#theme");
  if ($style) {
    $style.setAttribute("href", basePath + stylePath);
  }

  // remove scrollbars
  document.documentElement.style.overflow = "hidden";
  // trigger reflow so that overflow style is applied
  document.body.clientWidth;
  // change scheme
  document.documentElement.setAttribute("data-color-scheme", color);
  // remove overflow style, which will bring back the scrollbar with the correct scheme
  document.documentElement.style.overflow = "";

  localStorage.theme = color;
};
export default ThemeSwitcher;

const Icon = ({ dark }: { dark?: boolean }) => (
  <svg
    className="w-6 h-6"
    xmlns="http://www.w3.org/2000/svg"
    fill="white"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d={
        typeof dark === "undefined"
          ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      }
    ></path>
  </svg>
);