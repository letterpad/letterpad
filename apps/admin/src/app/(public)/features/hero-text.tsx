"use client";
import { useTheme } from "ui";

import { Mark } from "./mark";

export const HeroText = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  return (
    <h2
      className="text-3xl font-paragraph sm:text-6xl fill-white dark:text-gray-100"
      style={{
        background:
          "linear-gradient(to right bottom, rgb(255, 255, 255) 30%, rgba(255, 255, 255, 0.38)) text",
        WebkitTextFillColor: isDarkTheme ? "transparent" : "black",
      }}
    >
      Letterpad <Mark>Pro</Mark> is a blogging platform for <Mark>Pro</Mark>{" "}
      creators.
    </h2>
  );
};
