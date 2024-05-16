"use client";

import { useRef } from "react";
import { useIntersectionObserver } from "ui/dist/index.mjs";

type InViewProps = {
  children: React.ReactNode;
  className?: string;
};
export function InView({ children, className }: InViewProps) {
  const ref = useRef(null);
  const { hasLoaded } = useIntersectionObserver(ref, {});

  return (
    <div ref={ref} className={className}>
      {hasLoaded ? children : null}
    </div>
  );
}
