import classNames from "classnames";
import React, { ChangeEvent, FC, forwardRef, HTMLProps } from "react";

import { Label } from "./label";

const classes = {
  base: "px-4 py-2 focus:outline-none transition ease-in-out duration-300 rounded-md flex items-center justify-center flex-row block w-full",
  disabled: "opacity-50 cursor-not-allowed",
  error: "border-red-500 focus:border-red-500 dark:focus:border-red-500",
  variant: {
    primary:
      "bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
    dark: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-900",
    success:
      "bg-green-700 text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
    warning:
      "bg-yellow-700 text-white hover:bg-yellow-800 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800",
    secondary:
      "bg-gray-200 hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-gray-900 hover:text-white",
    danger:
      "bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white",
  },
};

interface Props extends HTMLProps<HTMLInputElement> {
  value?: string;
  variant?: "primary" | "secondary" | "danger" | "dark" | "success" | "warning";
  className?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputElement["type"];
  error?: boolean;
  label?: string;
  addonBefore?: string;
  help?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    className,
    variant = "primary",
    disabled = false,
    type = "text",
    error,
    label,
    help,
    addonBefore,
    ...rest
  } = props;

  if (label) {
    return (
      <div>
        <Label label={label} className="mb-2" />
        <div className="relative flex items-center">
          {addonBefore && (
            <span
              className={classNames(
                "absolute border-r border-gray-300 p-2 text-gray-700 dark:border-gray-600 dark:text-gray-300"
              )}
            >
              {addonBefore}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={classNames(
              error && classes.error,
              classes.base,
              classes.variant[variant],
              disabled && classes.disabled,
              className,
              { "pl-10": addonBefore }
            )}
            {...rest}
          />
        </div>
        {help && <span className="py-4 text-sm text-gray-500">{help}</span>}
      </div>
    );
  }
  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={classNames(
        error && classes.error,
        classes.base,
        classes.variant[variant],
        disabled && classes.disabled,
        className
      )}
      {...rest}
    />
  );
});
Input.displayName = "Input";
