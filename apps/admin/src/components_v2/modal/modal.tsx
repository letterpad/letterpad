import React, { CSSProperties, ReactNode, useEffect, useState } from "react";

import { IconClose } from "@/components/builder/toolbar/icons";

interface Props {
  show?: boolean;
  toggle: (val: boolean) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  header?: ReactNode;
  footer?: ReactNode[];
  zIndex?: number;
}

export const Modal = (props: Props) => {
  const [display, setDisplay] = useState<boolean>(props.show ? true : false);

  useEffect(() => {
    if (props.show) {
      setDisplay(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflowY = "auto";
      setDisplay(false);
    }
  }, [props.show]);

  if (display) {
    return (
      <>
        <div
          id="defaultModal"
          tabIndex={-1}
          aria-hidden="true"
          className="h-modal fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0 md:h-full"
          style={{ zIndex: props.zIndex ?? 11 }}
        >
          <div className="relative h-full w-full  max-w-2xl p-4 md:h-auto">
            <div className="relative rounded-md bg-white shadow dark:bg-gray-800">
              <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-200">
                  {props.header}
                </h3>
                <button
                  type="button"
                  className="ml-auto inline-flex items-center rounded-md bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => props.toggle(false)}
                >
                  <IconClose />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-6">{props.children}</div>

              <div className="flex items-end justify-end space-x-2 rounded-b border-t border-gray-200 py-4 px-4 dark:border-gray-700">
                <>{props.footer}</>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => props.toggle(false)}
          className="fixed top-0 left-0 z-10 h-screen w-screen bg-gray-300/50 backdrop-blur-sm dark:bg-black/40"
        />
      </>
    );
  } else return <div />;
};
