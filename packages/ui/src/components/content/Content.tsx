"use client";

import { FC, ReactNode, useEffect, useLayoutEffect, useRef } from "react";

export const Content: FC<{ children?: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const topSpace = ref.current.getBoundingClientRect().top;
      ref.current.style.height = `calc(100vh - ${topSpace}px - 48px)`;
    }
  }, []);
  return (
    <div
      className="flex min-h-0 w-full overflow-y-auto overflow-x-hidden"
      ref={ref}
      id="lp-content"
    >
      <div className="flex-1">{children}</div>
    </div>
  );
};
