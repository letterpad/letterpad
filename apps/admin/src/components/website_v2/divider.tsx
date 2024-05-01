import classNames from "classnames";
import { FC } from "react";

export const Divider: FC<{ className?: string }> = ({ className }) => (
  <hr
    className={classNames(
      " dark:border-gray-700 border-gray-200 w-full border-t-[1px] border-b-0",
      className
    )}
  />
);
