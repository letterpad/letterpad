import classNames from "classnames";
import { FC } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosWarning,
} from "react-icons/io";

import { InternalMessageProps } from "./types";

export const MessageMarkup: FC<InternalMessageProps> = ({
  success,
  error,
  warn,
  loading,
  content,
  showIcon = true,
}) => {
  // const textWidth = getTextWidth(content) + 120;
  // const width = Math.min(textWidth, Math.min(window.innerWidth - 100, 500));

  let Icon = IoIosCheckmarkCircle;
  if (error) {
    Icon = IoIosCloseCircle;
  } else if (warn) {
    Icon = IoIosWarning;
  } else if (loading) {
    Icon = AiOutlineLoading3Quarters;
  }
  return (
    <div
      className={classNames(
        "my-2 flex w-full items-center rounded-md  p-3 text-md shadow-md",
        {
          "bg-green-200": success,
          "bg-red-200": error,
          "bg-orange-200": warn,
          "bg-gray-200 dark:bg-gray-800": loading,
        }
      )}
    >
      {showIcon && (
        <div className="w-12">
          <Icon
            size={18}
            className={classNames("mr-3 font-extrabold ", {
              "text-green-600": success,
              "text-red-600": error,
              "text-orange-600": warn,
              "animate-spin": loading,
              "text-blue-600": loading,
            })}
          />
        </div>
      )}
      <span
        className={classNames("text-base leading-5 ", {
          "text-green-800": success,
          "text-red-800": error,
          "text-orange-800": warn,
          "text-gray-800 dark:text-gray-200": loading,
        })}
      >
        {content}
      </span>
    </div>
  );
};
