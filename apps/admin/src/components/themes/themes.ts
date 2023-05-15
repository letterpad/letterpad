//@ts-nocheck
import Air from "./screenshots/air.png";
import Grid from "./screenshots/grid.png";
import List from "./screenshots/list.png";

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
    // {
    //   label: "Air",
    //   value: "air",
    //   description:
    //     "The 2023 designers theme. Best for blogs with a lot of content.",
    //   image: Air,
    // },
  ];
};
