//@ts-nocheck
import Air from "./screenshots/air.png";
import Grid from "./screenshots/grid.png";
import List from "./screenshots/list.png";
import Wavique from "./screenshots/wavique.gif";
import Zenith from "./screenshots/zenith.png";

export const themes = () => {
  return [
    {
      label: "Minimal",
      value: "minimal",
      description: "A minimal and lightweight theme with maximum performance.",
      image: List,
    },
    {
      label: "Magazine",
      value: "magazine",
      description:
        "A theme with Grid layout. Should have cover images for every post.",
      image: Grid,
    },
    {
      label: "Wavique",
      value: "wavique",
      description:
        "A theme inspired from Oceans and Waves with a minimalistic design.",
      image: Wavique,
    },
    {
      label: "Zenith",
      value: "zenith",
      description:
        "Free from excess, focusing on essentials.",
      image: Zenith,
    },
    {
      label: "Amun",
      value: "amun",
      description:
        "The 2023 designers theme. Best for blogs with a lot of content.",
      image: Air,
    },
  ];
};
