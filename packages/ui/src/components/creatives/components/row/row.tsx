import classNames from "classnames";
import { FC } from "react";

import { ToolbarProvider } from "./row-toolbar-provider";
import { Cell } from "../cell";
import { Block } from "../../types";

export interface RowProps {
  row: Block;
  isPrevRowImageLeft: boolean;
  rowIndex: number;
}

export const Row: FC<RowProps> = ({ row, rowIndex }) => {
  const columns = Array.from({ length: row?.columns }, (_, i) => i);
  const isImage = row.data[1]?.type === "image";
  return (
    <div
      data-row
      className={classNames("relative flex flex-1 lg:flex-row", {
        "flex-col-reverse": isImage,
        "flex-col": columns.length === 2,
      })}
    >
      {columns.map((colIndex) => {
        return (
          <Cell
            key={colIndex}
            colIndex={colIndex}
            row={row}
            columns={row.columns}
            rowIndex={rowIndex}
          />
        );
      })}
    </div>
  );
};

export const EditableRow: FC<RowProps> = ({
  isPrevRowImageLeft,
  rowIndex,
  row,
}) => {
  return (
    <ToolbarProvider
      isPrevRowImageLeft={isPrevRowImageLeft}
      row={row}
      rowIndex={rowIndex}
    >
      <Row
        isPrevRowImageLeft={isPrevRowImageLeft}
        row={row}
        rowIndex={rowIndex}
      />
    </ToolbarProvider>
  );
};
