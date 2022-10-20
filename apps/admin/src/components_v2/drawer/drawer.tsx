import { FC } from "react";

import { IconClose } from "@/components/builder/toolbar/icons";

interface Props {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dir?: "right" | "left";
}
export const Drawer: FC<Props> = ({
  show,
  onClose,
  title,
  footer,
  children,
  dir = "right",
}) => {
  let className = dir === "left" ? "-translate-x-full left-0" : "";
  className = dir === "right" ? "right-0 translate-x-[calc(0vw)]" : "";

  return (
    <div
      className={
        "fixed top-0 z-40 h-screen w-80 overflow-y-auto bg-white p-4 transition-transform  dark:bg-gray-800 " +
        (show
          ? className
          : dir === "right"
          ? "right-0 translate-x-[calc(20vw)]"
          : "left-0 translate-x-full")
      }
      tabIndex={-1}
      aria-labelledby="drawer-label"
      aria-hidden="true"
    >
      <h5
        id="drawer-label"
        className="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
      >
        {title}
      </h5>
      <button
        onClick={() => onClose()}
        type="button"
        className="absolute top-2.5 right-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        <IconClose />
        <span className="sr-only">Close menu</span>
      </button>
      <p className="mb-6 flex-1 text-sm text-gray-500 dark:text-gray-400">
        {children}
      </p>
      <div className="bottom-0 left-0">{footer}</div>
    </div>
  );
};
