import classNames from "classnames";
import { FC, ReactNode } from "react";

export const Wrapper: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={classNames(
        "margin-auto flex h-full w-full flex-col items-baseline  justify-center p-6 leading-6 text-gray-800 dark:text-white lg:py-20 lg:px-40",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const hasText = (text: string) => {
  const decodedText = decodeURIComponent(text);
  return decodedText !== "<html><body></body></html>";
};

export const getHeight = (size?: "small" | "big" | "banner") => {
  const h = typeof window !== "undefined" ? window.innerHeight : 600;
  if (size === "small") return h * 0.4;
  if (size === "big") return h;
  if (size === "banner") return 200;
  return h;
};
