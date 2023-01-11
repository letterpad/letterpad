import classNames from "classnames";
import { FC } from "react";

interface Props {
  label: string;
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
