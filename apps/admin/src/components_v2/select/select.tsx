import { ChangeEvent, FC } from "react";

interface Props {
  title?: string;
  selected: string;
  items: { key: string; label: string }[];
  onChange: (key: string) => void;
  id: string;
}
export const Select: FC<Props> = ({ title, selected, items, onChange, id }) => {
  return (
    <>
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
        className="block w-full rounded-lg border border-gray-300 bg-gray-50  p-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 "
      >
        {items.map(({ key, label }) => (
          <option key={key} value={key} selected={key === selected}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
};
