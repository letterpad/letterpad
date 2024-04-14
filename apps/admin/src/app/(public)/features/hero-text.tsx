"use client";
import { useTheme } from "ui";

import { Mark } from "./mark";

export const HeroText = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  return (
    <h2
      data-aos="fade"
      data-aos-easing="linear"
      className="text-4xl font-paragraph sm:text-5xl fill-white dark:text-gray-100"
      style={{
        background:
          "linear-gradient(to right bottom, rgb(255, 255, 255) 30%, rgba(255, 255, 255, 0.38)) text",
        WebkitTextFillColor: isDarkTheme ? "transparent" : "black",
      }}
    >
      Introducing{" "}
      <span className="font-bold">
        Letterpad <Mark>Pro</Mark>
      </span>
    </h2>
  );
};
