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
          "text-white bg-blue-700 hover:bg-blue-800 button dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " +
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
          "text-white bg-gray-800 hover:bg-gray-900 button dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-900 " +
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
          "text-gray-900 bg-white hover:bg-gray-100 button " + className
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
          "text-white bg-red-700 hover:bg-red-800 button dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 " +
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
          "text-white bg-yellow-700 hover:bg-yellow-800 button dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 " +
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
          "text-white bg-green-700 hover:bg-green-800 button dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 " +
          className
        }
      >
        {children}
      </button>
    );
  }
  return null;
};
