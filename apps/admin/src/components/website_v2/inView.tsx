"use client";

import { useRef } from "react";
import { useIntersectionObserver } from "ui";

export function InView({ children }: { children: any }) {
  const ref = useRef(null);
  const { isIntersecting } = useIntersectionObserver(ref, {});
  return <div ref={ref}>{isIntersecting ? children : null}</div>;
}
