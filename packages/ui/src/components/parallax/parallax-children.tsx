import { VFC } from "react";

import { ParallaxChildrenProps } from "./types";

export const ParallaxChildren: VFC<ParallaxChildrenProps> = ({
  children,
  onMount,
  className,
}) => (
  <div
    ref={(node) => node && onMount(node)}
    className={className || "react-parallax-content"}
    style={{ position: "relative" }}
  >
    {children}
  </div>
);
