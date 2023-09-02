"use client";

import { useCallback, useEffect, useState } from "react";
import { BiSun } from "react-icons/bi";
import { BsMoonStars } from "react-icons/bs";

import { EventAction, track } from "@/track";

import { getCookie, setCookie } from "../utils/cookies";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(getCookie("theme") || "light");
  }, []);
  const switchTheme = useCallback(
    (color: string) => {
      ThemeSwitcher.switch(color);
      setTheme(color);
      if (color === theme) {
        return;
      }
      track({
        eventAction: EventAction.Click,
        eventCategory: "toggle",
        eventLabel: `theme.switcher - ${color}`,
      });
    },
    [theme]
  );

  useEffect(() => {
    switchTheme(getCookie("theme") || theme);
  }, [switchTheme, theme]);

  return (
    <>
      <div
        className="wrapper"
        onClick={() => switchTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <BiSun fill="#fff" size={20} />
        ) : (
          <BsMoonStars size={16} />
        )}
      </div>

      <style jsx global>{`
        .wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

ThemeSwitcher.switch = (color = "light") => {
  const $body = document.body;
  document.getElementsByTagName("html")[0].classList.add("no-transitions");
  if (color === "dark") {
    $body.classList.remove("light");
    $body.classList.add("dark");
  } else {
    $body.classList.remove("dark");
    $body.classList.add("light");
  }
  // change scheme
  document.documentElement.setAttribute("data-color-scheme", color);
  document.getElementsByTagName("html")[0].classList.remove("no-transitions");

  setCookie("theme", color);
};
export default ThemeSwitcher;
