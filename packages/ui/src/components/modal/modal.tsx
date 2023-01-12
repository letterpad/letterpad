import classNames from "classnames";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

import { Portal } from "./portal";

interface Props {
  show?: boolean;
  toggle: (val: boolean) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  header?: ReactNode;
  footer?: ReactNode[];
  zIndex?: number;
  size?: "sm" | "md" | "lg";
}

export const Modal = (props: Props) => {
  const [display, setDisplay] = useState<boolean>(props.show ? true : false);

  useEffect(() => {
    if (props.show) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  }, [props.show]);

  if (display) {
    return (
      <Portal>
        <div
          id="defaultModal"
          tabIndex={-1}
          aria-hidden="true"
          className="h-modal fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full"
          style={{ zIndex: props.zIndex ?? 50 }}
        >
          <div
            className={classNames(
              "relative h-full w-full  max-w-2xl p-4 md:h-auto",
              {
                "max-w-3xl": props.size === "md",
                "max-w-7xl": props.size === "lg",
              }
            )}
          >
            <div className="relative rounded-md bg-white shadow dark:bg-gray-800">
              <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-700">
                <h3 className="text-md font-medium text-gray-600 dark:text-gray-200">
                  {props.header}
                </h3>
                <button
                  type="button"
                  className="ml-auto inline-flex items-center rounded-md bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => props.toggle(false)}
                >
                  <IoClose size={20} />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-2">{props.children}</div>

              {props.footer && (
                <div className="flex items-end justify-end space-x-2 rounded-b border-t border-gray-200 py-4 px-4 dark:border-gray-700">
                  <>{props.footer}</>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          onClick={() => props.toggle(false)}
          className="fixed top-0 left-0 z-40 h-screen w-screen bg-gray-300/50 backdrop-blur-sm dark:bg-black/40"
        />
      </Portal>
    );
  } else return <div />;
};
