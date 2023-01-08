import classNames from "classnames";
import { FC, Key } from "react";

import { Label } from "../input";

interface RadioItem<T> {
  value: T;
  label: string;
}

interface Props<T> {
  selected: T;
  items: RadioItem<T>[];
  onChange: (item: RadioItem<T>) => void;
  label: string;
}

export function RadioGroup<T extends Key>({
  selected,
  items,
  onChange,
  label,
}: Props<T>) {
  return (
    <div>
      <Label label={label} />
      <div className="mt-4 flex">
        {items.map((item) => {
          const id = item.label.split(" ").join("").toLowerCase();
          return (
            <div
              key={item.value}
              className={classNames("flex  items-center", {
                "mr-4": item !== items[items.length - 1],
              })}
            >
              <input
                id={id}
                type="radio"
                value={item.value}
                name="radio-group"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                checked={item.value === selected}
                onChange={() => onChange(item)}
              />
              <label
                htmlFor={id}
                className="ml-2 cursor-pointer text-sm font-medium "
              >
                {item.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
