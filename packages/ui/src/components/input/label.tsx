import classNames from "classnames";
import React, { FC } from "react";

interface Props {
  label: string | React.ReactNode;
  className?: string;
}
export const Label: FC<Props> = ({ label, className = "" }) => {
  return (
    <label
      className={classNames(
        "block text-sm font-medium text-gray-700 dark:text-gray-300",
        className
      )}
    >
      {label}
    </label>
  );
};
