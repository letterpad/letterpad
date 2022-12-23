import classNames from "classnames";
import React, {
  ChangeEvent,
  FC,
  forwardRef,
  HTMLProps,
  useEffect,
  useState,
} from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Buttonv2 } from "../button";

const classes = {
  base: "px-4 py-2 focus:outline-none transition ease-in-out duration-300 rounded-md flex items-center justify-center flex-row",
  disabled: "opacity-50 cursor-not-allowed",
  error: "border-red-500 focus:border-red-500 dark:focus:border-red-500",
  variant: {
    primary:
      "bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
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
  onSearch?: (value: string) => void;
  enterButton?: string;
  loading?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [inputValue, setInputValue] = useState(props.value || "");
  const {
    className,
    variant = "primary",
    disabled = false,
    type = "text",
    error,
    onSearch,
    onChange,
    value,
    loading = false,
    enterButton,
    ...rest
  } = props;

  useEffect(() => {
    setInputValue(props.value ?? "");
  }, [props.value]);

  return (
    <div className="flex w-full">
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
          "rounded-r-none border-r-0"
        )}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange && onChange(e);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onSearch && onSearch(inputValue);
          }
        }}
        value={inputValue}
        {...rest}
      />

      <Buttonv2
        type="submit"
        className="rounded-l-none"
        onClick={() => onSearch && onSearch(inputValue)}
        disabled={loading}
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin" size={14} />
        ) : (
          enterButton
        )}
      </Buttonv2>
    </div>
  );
});
SearchInput.displayName = "SearchInput";
