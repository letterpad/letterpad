import classNames from "classnames";
import Link from "next/link";
import { FC, HTMLAttributeAnchorTarget, ReactNode } from "react";

interface Props {
  label: string;
  icon: ReactNode;
  path?: string;
  onClick?: (e: any) => void;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
}

export const MenuItem: FC<Props> = ({
  label,
  icon,
  path = "#",
  onClick,
  className,
  target,
}) => {
  return (
    <li
      className={classNames(
        "py-2.5 px-4  hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 text-sm cursor-pointer",
        className
      )}
    >
      <Link
        className="flex items-center gap-2"
        href={path}
        onClick={onClick}
        target={target}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
};
