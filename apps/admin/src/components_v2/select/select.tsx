import { ChangeEvent, FC } from "react";

interface Props {
  title?: string;
  selected: any;
  items: { key: any; label: any }[];
  onChange: (key: any) => void;
  id: string;
  className?: string;
}
export const Select: FC<Props> = ({
  title,
  selected,
  items,
  onChange,
  id,
  className,
}) => {
  return (
    <div className={className}>
      {title && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          {title}
        </label>
      )}
      <select
        id={id}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          onChange(e.target.value);
        }}
        value={selected}
        className="block w-full rounded-md border border-gray-300 bg-gray-50  px-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 "
      >
        {items.map(({ key, label }) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
