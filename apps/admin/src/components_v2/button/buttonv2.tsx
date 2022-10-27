import classNames from "classnames";
import React, {
  FC,
  forwardRef,
  HTMLProps,
  MouseEvent,
  PropsWithChildren,
  ReactNode,
} from "react";

const classes = {
  base: "focus:outline-none transition ease-in-out duration-300 rounded-md flex items-center justify-center flex-row",
  disabled: "opacity-50 cursor-not-allowed",
  pill: "rounded-full",
  size: {
    small: "px-2 py-1 text-sm",
    normal: "px-4 py-2",
    large: "px-8 py-3 text-lg",
  },
  variant: {
    primary:
      "bg-blue-500 hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white",
    dark: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-900",
    success:
      "bg-green-700 text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
    warning:
      "bg-yellow-700 text-white hover:bg-yellow-800 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800",
    secondary:
      "bg-gray-200 hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-gray-900 hover:text-white",
    danger:
      "bg-red-500 hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white",
    ghost: "text-blue-600",
  },
};

interface Props {
  children: ReactNode;
  pill?: boolean;
  size?: "small" | "normal" | "large";
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "dark"
    | "success"
    | "warning"
    | "ghost";
  className?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
  type?: "button" | "submit" | "reset";
}

export const Buttonv2 = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
  (props, ref) => {
    const {
      children,
      className,
      variant = "primary",
      size = "normal",
      pill,
      disabled = false,
      ...rest
    } = props;
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={classNames(
          classes.base,
          classes.size[size],
          classes.variant[variant],
          pill && classes.pill,
          disabled && classes.disabled,
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
Buttonv2.displayName = "Button";
