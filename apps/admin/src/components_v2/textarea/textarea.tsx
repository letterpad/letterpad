import classNames from "classnames";
import React, { ChangeEvent, FC, forwardRef, HTMLProps } from "react";

const classes = {
  base: "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
  disabled: "opacity-50 cursor-not-allowed",
  error: "border-red-500 focus:border-red-500 dark:focus:border-red-500",
};

interface Props extends HTMLProps<HTMLTextAreaElement> {
  value?: string;
  variant?: "primary" | "secondary" | "danger" | "dark" | "success" | "warning";
  className?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const {
    className,
    variant = "primary",
    disabled = false,
    error,
    ...rest
  } = props;
  return (
    <textarea
      ref={ref}
      disabled={disabled}
      className={classNames(
        error && classes.error,
        classes.base,
        disabled && classes.disabled,
        className,
      )}
      {...rest}
    />
  );
});
TextArea.displayName = "TextArea";
