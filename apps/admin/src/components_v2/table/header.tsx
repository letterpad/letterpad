import { FC } from "react";

import { Columns } from "./types";

interface Props {
  columns: Columns[];
}

export const Header: FC<Props> = ({ columns }) => {
  return (
    <thead>
      <tr>
        {columns.map((item) => {
          return (
            <th className="border-b-2 border-gray-200 bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              {item.title}
            </th>
          );
        })}

        <th className="border-b-2 border-gray-200  bg-gray-100 px-5 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"></th>
      </tr>
    </thead>
  );
};
