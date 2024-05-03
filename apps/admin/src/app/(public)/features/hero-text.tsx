"use client";
import { FC, ReactNode } from "react";
import { useTheme } from "ui";

export const HeroText: FC<{ headline: ReactNode; addShadow?: boolean }> = ({
  headline,
  addShadow = true,
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const style = {
    background:
      "linear-gradient(to right bottom, rgb(255, 255, 255) 30%, rgba(255, 255, 255, 0.38)) text",
    WebkitTextFillColor: isDarkTheme ? "transparent" : "black",
  };

  return (
    <h2
      data-aos="fade"
      data-aos-easing="linear"
      className="text-4xl sm:text-5xl fill-white dark:text-gray-100"
      style={addShadow ? style : {}}
    >
      {headline}
    </h2>
  );
};
