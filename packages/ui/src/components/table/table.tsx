import { FC } from "react";

import { Header } from "./header";
import { Rows } from "./rows";
import { Columns } from "./types";

interface Props {
  columns: Columns[];
  dataSource: any;
  loading: boolean;
  onRowClick?: any;
}

export const Table: FC<Props> = ({
  columns,
  dataSource = [],
  onRowClick,
  loading,
}) => {
  const cleanColumns = columns.filter((column) => column);
  return (
    <div className="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8">
      <div className="inline-block min-w-full overflow-hidden rounded-lg shadow-md">
        <table className="min-w-full leading-normal">
          <Header columns={cleanColumns} />
          {/* {!loading && dataSource?.length === 0 && "No records found."} */}
          <Rows
            dataSource={dataSource}
            columns={cleanColumns}
            onRowClick={onRowClick}
            loading={loading}
          />
        </table>
      </div>
    </div>
  );
};
