import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";

interface Item {
  icon?: JSX.Element;
  label: string;
  group?: string;
  key: string;
  badge?: string;
}
interface Props {
  items: Item[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

const classes = {
  base: "flex h-10 flex-row items-center rounded-lg px-3 text-gray-300",
  hover: "hover:bg-gray-800 hover:text-gray-200",
  group: "my-4  px-4 text-sm font-medium uppercase text-gray-300",
  selected: "bg-gray-800 text-gray-200",
  badge:
    "ml-auto flex items-center justify-center rounded-full bg-gray-700 w-5 h-5 text-xs font-semibold text-gray-200 shadow-md",
};

export const Menu: FC<Props> = ({ items, selectedKey, onSelect, ...props }) => {
  return (
    <ul className="flex w-full flex-col">
      {items.map((item) => {
        if (item.group) {
          return (
            <li className="my-px" key={item.key}>
              <span className={classNames(classes.base, classes.group)}>
                {item.group}
              </span>
            </li>
          );
        }

        return (
          <li className="my-px" key={item.key}>
            <Link href={item.key}>
              <a
                className={classNames(
                  classes.base,
                  classes.hover,
                  item.key === selectedKey && classes.selected,
                )}
                onClick={() => {
                  onSelect(item.key);
                }}
              >
                <span className="flex items-center justify-center text-lg text-gray-400">
                  {item.icon}
                </span>
                <span className="ml-3">{item.label}</span>
                {item.badge && (
                  <span className={classes.badge}>{item.badge}</span>
                )}
              </a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
