import { ChangeEvent } from "react";

export const MixBlendCheckbox = ({ mixBlendDifference = false, onChange }) => {
  return (
    <div className="flex flex-col ">
      <div className="flex items-center mb">
        <input
          type="checkbox"
          checked={mixBlendDifference}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.checked);
          }}
          id="mixblend"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="mixblend"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Enable Mix Blend Difference
        </label>
      </div>
      <span className="opacity-60 text-xs">
        This is used in few themes to compensate the text color from background.
      </span>
    </div>
  );
};
