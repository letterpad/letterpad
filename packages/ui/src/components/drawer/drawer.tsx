import { animated, useSpring } from "@react-spring/web";
import classNames from "classnames";
import { FC, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { useEscapeKey } from "./useEscapeKey";
import { disableScroll } from "../../utils";

interface Props {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dir?: "right" | "left" | "top" | "bottom";
  className?: string;
  scale?: boolean;
  closeIcon?: boolean;
}
export const Drawer: FC<Props> = ({
  show,
  onClose,
  title,
  footer,
  children,
  dir = "bottom",
  className,
  scale = false,
  closeIcon = true,
}) => {
  let initalClass = dir === "left" ? "left-0 top-0" : "";
  initalClass = dir === "right" ? "right-0 top-0" : initalClass;
  initalClass = dir === "top" ? "top-0 left-0" : initalClass;
  initalClass = dir === "bottom" ? "bottom-0 left-0" : initalClass;

  let transform =
    dir === "top" ? (show ? "translateY(0)" : "translateY(-100%)") : "";
  transform =
    dir === "bottom"
      ? show
        ? "translateY(0)"
        : "translateY(100%)"
      : transform;
  transform =
    dir === "left" ? (show ? "translateX(0)" : "translateX(-100%)") : transform;
  transform =
    dir === "right" ? (show ? "translateX(0)" : "translateX(100%)") : transform;

  const animation = useSpring({
    opacity: show ? 1 : 0,
    transform,
    config: {
      tension: 200,
      friction: 25,
    },
    scale: scale ? (show ? 1 : 0.2) : 1,
    delay: 2,
  });

  useEscapeKey(()=> onClose());

  useEffect(() => {
    disableScroll(show);
  }, [show]);

  return (
    <>
      {show && (
        <div
          onClick={() => onClose()}
          className="fixed inset-0 z-30 bg-zinc-800 bg-opacity-50 dark:bg-opacity-80"
        />
      )}
      <animated.div
        style={animation}
        className={classNames(
          className,
          "fixed z-40 p-4 overflow-y-auto bg-zinc-100 shadow-md  dark:bg-zinc-900",
          initalClass,
          {"h-screen": dir === "left" || dir === "right"}
        )}
        tabIndex={-1}
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        {title && (
          <h5
            id="drawer-label"
            className="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-300"
          >
            {title}
          </h5>
        )}
        {closeIcon && (
          <button
            onClick={() => onClose()}
            type="button"
            data-testid="close-drawer"
            className="absolute top-2.5 right-2.5 inline-flex items-center rounded-lg bg-transparent p-1 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <IoCloseOutline size={20} />
            <span className="sr-only">Close menu</span>
          </button>
        )}
        <div className="mb-6 flex-1 text-sm text-gray-500 dark:text-gray-300">
          {show && children}
        </div>
        <div className="bottom-0 left-0">{footer}</div>
      </animated.div>
    </>
  );
};
