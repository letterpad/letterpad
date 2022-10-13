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
}

export const Modal = (props: Props) => {
  const [display, setDisplay] = useState<boolean>(props.show ? true : false);

  useEffect(() => {
    if (props.show) {
      setDisplay(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
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
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex "
        >
          <div className="relative p-4 w-full  h-full md:h-auto max-w-2xl">
            <div className="relative bg-white rounded-md shadow dark:bg-gray-800">
              <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {props.header}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={() => props.toggle(false)}
                >
                  <IconClose />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-6 space-y-6">{props.children}</div>

              <div className="flex items-end justify-end p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-700">
                <>{props.footer}</>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => props.toggle(false)}
          className="backdrop-blur-sm bg-white/40 dark:bg-black/40 w-screen h-screen absolute top-0 left-0 z-10"
        />
      </>
    );
  } else return <div />;
};
