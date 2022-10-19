import classNames from "classnames";
import { FC } from "react";

import { Cell } from "./cell";
import { useBuilderContext } from "../../context";
import { LayoutToolbar } from "../../toolbar/layout-toolbar";
import { Swap } from "../../toolbar/swap";
import { Block } from "../../types";

export interface PlaceholderProps {
  row: Block;
  isPrevRowImageLeft: boolean;
  rowIndex: number;
}
export const Row: FC<PlaceholderProps> = ({
  row,
  isPrevRowImageLeft,
  rowIndex,
}) => {
  const { updateRow, moveRow, swapColumns, preview } = useBuilderContext();

  const columns = Array.from({ length: row?.columns }, (_, i) => i);
  const showSwap = !preview && row?.columns === 2;

  return (
    <div
      className={classNames("relative flex-1 ", {
        "border-2 border-t-0 border-dotted border-gray-200 dark:border-gray-700 ":
          !preview,
      })}
    >
      {!preview && (
        <LayoutToolbar
          onChange={(block) => updateRow(block, rowIndex)}
          item={row}
          move={(dir) => moveRow(rowIndex, dir)}
          isPrevRowImageLeft={isPrevRowImageLeft}
          rowIndex={rowIndex}
        />
      )}
      {showSwap && (
        <Swap
          onClick={() => {
            swapColumns(rowIndex);
          }}
        />
      )}

      <div
        data-row
        className={classNames("relative flex flex-1  lg:flex-row", {
          // "h-[calc(60vh)]": !row.cover && rowIndex === 0,
          "flex-col-reverse": row.data[1]?.type === "image",
          "flex-col": row.data[1]?.type === "text",
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
    </div>
  );
};
