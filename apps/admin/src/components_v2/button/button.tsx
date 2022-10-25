import { FC, MouseEvent, ReactNode } from "react";

interface Props {
  type?: "primary" | "dark" | "light" | "danger" | "warning" | "success";
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  testid?: string;
}

export const Button: FC<Props> = ({
  type = "primary",
  children,
  onClick,
  className,
  testid,
}) => {
  if (type === "primary") {
    return (
      <button
        data-testid={testid}
        type="button"
        onClick={onClick}
        className={
          "button bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " +
          className
        }
      >
        {children}
      </button>
    );
  } else if (type === "dark") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={
          "button bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-900 " +
          className
        }
      >
        {children}
      </button>
    );
  } else if (type === "light") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={
          "button bg-gray-100 text-gray-900 hover:bg-gray-100 " + className
        }
      >
        {children}
      </button>
    );
  } else if (type === "danger") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={
          "button bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 " +
          className
        }
      >
        {children}
      </button>
    );
  } else if (type === "warning") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={
          "button bg-yellow-700 text-white hover:bg-yellow-800 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 " +
          className
        }
      >
        {children}
      </button>
    );
  } else if (type === "success") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={
          "button bg-green-700 text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 " +
          className
        }
      >
        {children}
      </button>
    );
  }
  return null;
};
