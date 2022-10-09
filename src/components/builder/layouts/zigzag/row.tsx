import classNames from "classnames";
import { FC } from "react";

import { Cell } from "./cell";
import { useBuilderContext } from "../../context";
import { LayoutToolbar } from "../../toolbar/layout-toolbar";
import { Swap } from "../../toolbar/swap";
import { Block, BlockItem as BlockData } from "../../types";

export interface PlaceholderProps {
  item: Block;
  isPrevRowImageLeft: boolean;
  rowIndex: number;
}
export const Row: FC<PlaceholderProps> = ({
  item,
  isPrevRowImageLeft,
  rowIndex,
}) => {
  const { updateRow, moveRow, swapColumns, preview } = useBuilderContext();

  const columns = Array.from({ length: item?.columns }, (_, i) => i);
  const showSwap = !preview && item?.columns === 2;

  return (
    <div
      className={classNames("flex-1 relative ", {
        "border-dotted border-2 border-gray-200 dark:border-gray-700 border-t-0 ":
          !preview,
      })}
    >
      {!preview && (
        <LayoutToolbar
          onChange={(block) => updateRow(block, rowIndex)}
          item={item}
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
        className={classNames("flex lg:flex-row", {
          "h-screen": item.cover === "big",
          "h-[calc(40vh)]": item.cover === "small",
          // "h-[calc(80vh)]": !item.cover,
          "flex-col-reverse": item.data[1]?.type === "image",
          "flex-col": item.data[1]?.type === "text",
        })}
      >
        {columns.map((colIndex) => {
          return (
            <Cell
              key={colIndex}
              colIndex={colIndex}
              item={item.data[colIndex]}
              columns={item.columns}
              rowIndex={rowIndex}
            />
          );
        })}
      </div>
    </div>
  );
};
