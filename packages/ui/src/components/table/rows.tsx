import { FC, PropsWithChildren } from "react";

import { Columns } from "./types";
import { TablePlaceholder } from "../placeholders";

interface Props {
  dataSource: any;
  columns: Columns[];
  onRowClick?: any;
  loading: boolean;
}

const classes = {
  row: "hover:dark:bg-gray-800",
  cell: "border-b border-gray-200 bg-white px-5 py-5 dark:bg-black/10 dark:text-gray-100 dark:border-gray-800 ",
};

export const Rows: FC<Props> = ({
  dataSource,
  columns,
  onRowClick,
  loading,
}) => {
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
          <td
            colSpan={columns.length}
            className="bg-slate-50 dark:bg-slate-800"
          >
            <div className="p-4 py-16 text-center">No records found</div>
          </td>
        </Row>
      )}
      {dataSource.map((item, index) => {
        return (
          <Row onRowClick={() => onRowClick?.(item)} key={item.id}>
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
          </Row>
        );
      })}
    </tbody>
  );
};

const Row: FC<PropsWithChildren<{ onRowClick: any }>> = ({
  onRowClick,
  children,
}) => {
  return (
    <tr onClick={onRowClick} className={classes.row}>
      {children}
    </tr>
  );
};
