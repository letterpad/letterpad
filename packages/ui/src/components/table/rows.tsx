import { FC, PropsWithChildren } from "react";

import { Columns } from "./types";
import { TablePlaceholder } from "../placeholders";

interface Props<T extends { [key: string]: any }> {
  dataSource: T[];
  columns: Columns[];
  onRowClick?: (item: T) => void;
  loading: boolean;
}

const classes = {
  row: "hover:dark:bg-gray-800",
  cell: "border-b border-gray-200 bg-white px-5 py-5 dark:bg-black/10 dark:text-gray-100 dark:border-gray-800",
};

export const Rows = <T extends { [key: string]: any }>({
  dataSource,
  columns,
  onRowClick,
  loading,
}: Props<T>) => {
  const fields = columns.map((item) => item?.dataIndex) as string[];

  return (
    <tbody>
      {loading && (
        <Row onRowClick={() => {}}>
          <td colSpan={columns.length}>
            <TablePlaceholder loading={loading} className="mt-4" />
          </td>
        </Row>
      )}
      {!loading && !dataSource.length && (
        <Row onRowClick={() => {}}>
          <td colSpan={columns.length} className="bg-slate-50 dark:bg-slate-800">
            <div className="p-4 py-16 text-center">No records found</div>
          </td>
        </Row>
      )}
      {!loading &&
        dataSource.map((item, index) => {
          return (
            <Row onRowClick={() => onRowClick?.(item)} key={index}>
              {fields.map((key, idx) => {
                const props = columns[idx];
                return (
                  <td className={classes.cell + " " + props?.className} key={idx}>
                    <div className="flex items-center">
                      <div className="space-y-2">
                        <div className="whitespace-no-wrap">
                          {props?.render ? props.render(item[key], item) : item[key]}
                        </div>
                      </div>
                    </div>
                  </td>
                );
              })}
            </Row>
          );
        })}
    </tbody>
  );
};

const Row: FC<PropsWithChildren<{ onRowClick: () => void }>> = ({
  onRowClick,
  children,
}) => {
  return (
    <tr onClick={onRowClick} className={classes.row}>
      {children}
    </tr>
  );
};
