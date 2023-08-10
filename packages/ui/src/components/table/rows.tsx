import { FC } from "react";

import { Columns } from "./types";

interface Props {
  dataSource: any;
  columns: Columns[];
  onRowClick: any;
}

const classes = {
  row: "hover:dark:bg-gray-800",
  cell: "border-b border-gray-200 bg-white px-5 py-5 dark:bg-black/10 dark:text-gray-100 dark:border-gray-800 ",
};

export const Rows: FC<Props> = ({ dataSource, columns, onRowClick }) => {
  const fields = columns.map((item) => item?.dataIndex) as string[];
  return (
    <tbody>
      {dataSource.map((item, index) => {
        return (
          <tr
            key={index}
            onClick={() => onRowClick && onRowClick(item)}
            className={classes.row}
          >
            {fields.map((key, idx) => {
              const props = columns[idx];
              return (
                <td className={classes.cell + " " + props?.className} key={idx}>
                  <div className="flex items-center">
                    <div className="space-y-2">
                      <div className="whitespace-no-wrap">
                        {props?.render
                          ? props.render(item[key], item)
                          : item[key]}
                      </div>
                    </div>
                  </div>
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};
