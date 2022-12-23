import classNames from "classnames";
import React, { FC, ReactNode, useState } from "react";

import { Buttonv2 } from "../button";

interface Props {
  onConfirm: () => void;
  children?: ReactNode;
  className?: string;
  okText?: string;
  cancelText?: string;
  title?: string;
  description?: string | ReactNode;
  visible?: boolean;
}

export const PopConfirm: FC<Props> = ({
  children,
  description,
  title,
  onConfirm,
  okText = "Yes",
  cancelText = "No",
  visible = false,
  className,
}) => {
  const [display, setDisplay] = useState<boolean>(visible);

  return (
    <>
      <div
        className={classNames(
          "fixed top-0 left-0 h-screen w-screen bg-gray-300/50 backdrop-blur-sm dark:bg-black/40",
          { hidden: !display }
        )}
        style={{ zIndex: 41 }}
      />
      <div
        id="popup-modal"
        tabIndex={-1}
        className={classNames(
          "fixed z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full",
          {
            hidden: !display,
          },
          className
        )}
      >
        <div className="relative h-full w-full max-w-md md:h-auto">
          <div className="relative rounded-md bg-white shadow dark:bg-gray-700">
            <div className="p-6 text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {title}
              </h3>
              {description && <span>{description}</span>}
              <div className="mt-5 flex justify-center gap-2">
                <Buttonv2
                  variant="danger"
                  onClick={() => onConfirm()}
                  className="okModalBtn"
                >
                  {okText}
                </Buttonv2>
                {cancelText && (
                  <Buttonv2
                    variant="secondary"
                    onClick={() => setDisplay(false)}
                  >
                    {cancelText}
                  </Buttonv2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div onClick={() => setDisplay(true)}>{children}</div>
    </>
  );
};
