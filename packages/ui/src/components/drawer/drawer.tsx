import { FC, useEffect } from "react";
import { useSpring, config, animated } from "@react-spring/web"
import { IoCloseOutline } from "react-icons/io5";

import { disableScroll } from "../../utils";
import classNames from "classnames";

interface Props {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dir?: "right" | "left" | "top" | "bottom";
  className?: string;
}
export const Drawer: FC<Props> = ({
  show,
  onClose,
  title,
  footer,
  children,
  dir = "bottom",
  className
}) => {
  let initalClass = dir === "left" ? "left-0 top-0" : "";
  initalClass = dir === "right" ? "right-0 top-0" : initalClass;
  initalClass = dir === "top" ? "top-0 left-0" : initalClass
  initalClass = dir === "bottom" ? "bottom-0 left-0" : initalClass


  let transform = dir === "top" ? show? "translateY(0)":"translateY(-100%)":"";
  transform = dir === "bottom" ? show? "translateY(0)":"translateY(100%)":transform;
  transform = dir === "left" ? show? "translateX(0)":"translateX(-100%)":transform;
  transform = dir === "right" ? show? "translateX(0)":"translateX(100%)":transform;



  const animation = useSpring({
    opacity: show ? 1 : 0,
    transform,
    config: {
      tension: 200,
      friction: 20,
    },
    scale: show ? 1 : 0.2,
    delay:2,
  });

  useEffect(() => {
    disableScroll(show);
  }, [show]);

  return (
    <>
      {show && (
        <div
          onClick={() => onClose()}
          className="fixed inset-0 z-30 bg-zinc-800 bg-opacity-50 dark:bg-opacity-80"
        ></div>
      )}
      <animated.div
      style={animation}
      className={classNames(className,"fixed z-40 h-screen p-4 overflow-y-auto bg-zinc-100 shadow-md  dark:bg-zinc-900", initalClass)}
        tabIndex={-1}
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5
          id="drawer-label"
          className="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-300"
        >
          {title}
        </h5>
        <button
          onClick={() => onClose()}
          type="button"
          data-testid="close-drawer"
          className="absolute top-2.5 right-2.5 inline-flex items-center rounded-lg bg-transparent p-1 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <IoCloseOutline size={20} />
          <span className="sr-only">Close menu</span>
        </button>
        <div className="mb-6 flex-1 text-sm text-gray-500 dark:text-gray-300">
          {children}
        </div>
        <div className="bottom-0 left-0">{footer}</div>
      </animated.div>
    </>
  );
};
