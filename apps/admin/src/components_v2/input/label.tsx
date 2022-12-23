import classNames from "classnames";

export const Label = ({ label, className = "" }) => {
  return (
    <label
      className={classNames(
        "block text-sm font-medium text-gray-700 dark:text-gray-300",
        className
      )}
    >
      {label}
    </label>
  );
};
