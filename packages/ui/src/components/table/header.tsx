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
            <th
              key={item?.key}
              className={`border-b-1 border-gray-400 bg-gray-200 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-100 ${item?.className}`}
            >
              {item?.title}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
