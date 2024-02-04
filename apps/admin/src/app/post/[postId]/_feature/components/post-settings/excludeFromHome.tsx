import { ChangeEvent, FC, useState } from "react";

import {} from "@/__generated__/__types__";

interface Props {
  status: boolean;
  onChange: (status: Boolean) => void;
}
export const ExcludeFromHome: FC<Props> = ({ status, onChange }) => {
  const [flag, setFlag] = useState(status);
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        checked={flag}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFlag(e.target.checked);
          onChange(e.target.checked);
        }}
        id="exclude-home"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor="exclude-home"
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Exclude this post from home page
      </label>
    </div>
  );
};
