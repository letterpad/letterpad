import classNames from "classnames";

export const Badge = ({ label, count, active, onClick, fetching }) => {
  return (
    <span
      onClick={onClick}
      className={classNames(
        "flex cursor-pointer items-center gap-2  rounded-md border-[1px] px-2 py-1",
        {
          "border-transparent bg-slate-100 text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-400":
            !active,
          "border-slate-500 bg-slate-500  text-slate-100 dark:border-blue-700 dark:bg-blue-600 dark:text-blue-200":
            active,
        }
      )}
    >
      {fetching ? <span className="">{label}</span> : label}
      <span
        className={classNames(
          "flex h-5 w-5 items-center justify-center rounded-full text-xs",
          {
            "bg-slate-200 dark:bg-slate-800": !active,
            "bg-slate-700 text-blue-100 dark:bg-blue-800 dark:text-blue-100":
              active,
          }
        )}
      >
        {count}
      </span>
    </span>
  );
};
