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
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          {title}
        </label>
      )}
      <select
        id={id}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          onChange(e.target.value);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
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
