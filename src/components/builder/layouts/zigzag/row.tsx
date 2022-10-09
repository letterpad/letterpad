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
  const className = !preview
    ? " border-dotted border-2 border-gray-200 dark:border-gray-700 border-t-0 "
    : "";
  return (
    <div className={"flex-1 relative " + className}>
      {!preview && (
        <LayoutToolbar
          onChange={(block) => updateRow(block, rowIndex)}
          item={item}
          move={(dir) => moveRow(rowIndex, dir)}
          isPrevRowImageLeft={isPrevRowImageLeft}
        />
      )}
      {showSwap && (
        <Swap
          onClick={() => {
            swapColumns(rowIndex);
          }}
        />
      )}

      <div>
        <div className={"flex flex-col lg:flex-row  h-[calc(80vh)] "}>
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
    </div>
  );
};

// preview={preview}
//                 onChange={(block) => updateRow(block, i)}
//                 onRemove={(col) => removeCell(i, col)}
//                 move={(dir) => moveRow(i, dir)}
//                 swapColumns={() => swapColumns(i)}
