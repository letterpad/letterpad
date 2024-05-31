"use client";
import classNames from "classnames";
import { FC, useEffect, useState } from "react";

export interface MenuItem {
  icon?: JSX.Element;
  label: string;
  group?: string;
  key: string;
  badge?: string;
  testid?: string;
  hidden?: boolean;
  className?: string;
}
interface Props {
  items: MenuItem[];
  selectedKey: string;
  onSelect: (e: React.MouseEvent, key: string) => void;
  Link: any;
}

const classes = {
  base: "flex h-10 flex-row items-center rounded-lg px-3 text-gray-300",
  hover: "hover:bg-gray-800 hover:text-gray-200",
  group: "my-4  px-4 text-sm font-medium uppercase text-gray-300",
  selected: "bg-gray-800 text-gray-200",
  badge:
    "ml-auto flex items-center justify-center rounded-full bg-gray-700 w-6 h-6 text-[0.7rem] text-gray-200 shadow-md",
};

export const Menu: FC<Props> = ({
  items,
  selectedKey,
  onSelect,
  Link,
  ...props
}) => {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <ul className="flex w-full flex-col">
      {items.filter(item=> !item.hidden).map((item) => {
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
          <li className={classNames("my-px", item.className)} key={item.key}>
            <Link
              href={item.key}
              data-testid={item.testid}
              className={classNames(
                classes.base,
                classes.hover,
                item.key === selectedKey && classes.selected
              )}
              onClick={(e: any) => {
                onSelect(e, item.key);
              }}
              prefetch={false}
            >
              <span className="flex items-center justify-center text-lg text-gray-400">
                {item.icon}
              </span>
              <span className="ml-3">{item.label}</span>
              {domLoaded && item.badge && (
                <span className={classes.badge}>{item.badge}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
