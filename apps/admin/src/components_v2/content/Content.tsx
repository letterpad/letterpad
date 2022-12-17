import { useEffect, useRef } from "react";

export const Content = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const topSpace = ref.current.getBoundingClientRect().top;
      ref.current.style.height = `calc(100vh - ${topSpace}px - 48px)`;
    }
  }, []);
  return (
    <div className="flex min-h-0 w-full overflow-y-auto" ref={ref}>
      <div className="flex-1">{children}</div>
    </div>
  );
};
