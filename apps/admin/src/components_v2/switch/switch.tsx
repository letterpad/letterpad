import classNames from "classnames";
import { ChangeEvent, FC, useEffect, useState } from "react";

import { Label } from "../input";

interface Props {
  label: string;
  active: boolean;
  onChange: (active: boolean) => void;
  size?: "sm" | "md" | "lg";
}

export const Switch: FC<Props> = ({
  label,
  active,
  onChange,
  size = "md",
  ...rest
}) => {
  const [checked, setChecked] = useState(active);

  useEffect(() => {
    setChecked(active);
  }, [active]);

  return (
    <div className="flex items-center">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          value=""
          className="peer sr-only"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.checked);
            setChecked(e.target.checked);
          }}
          checked={checked}
          {...rest}
        />
        <div
          className={classNames(
            "peer  rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800",
            {
              "h-5 w-9": size === "sm",
              "h-6 w-11": size === "md",
              "h-7 w-14": size === "lg",
            },
          )}
        ></div>
      </label>
      <Label label={label} className="ml-3" />
    </div>
  );
};
