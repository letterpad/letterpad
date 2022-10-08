import { FC } from "react";

import { Cell } from "./cell";
import { LayoutToolbar } from "../../toolbar/layout-toolbar";
import { Swap } from "../../toolbar/swap";
import { Block, BlockItem as BlockData } from "../../types";

export interface PlaceholderProps {
  item: Block;
  onChange: (change: Block) => void;
  move: (dir: "up" | "down") => void;
  preview: boolean;
  onRemove: (col?: number) => void;
  swapColumns: () => void;
  isPrevRowImageLeft: boolean;
  rowIndex: number;
}
export const Row: FC<PlaceholderProps> = ({
  item,
  onChange,
  move,
  preview,
  onRemove,
  swapColumns,
  isPrevRowImageLeft,
  rowIndex,
}) => {
  const updateBlock = (newData: BlockData, position = 0) => {
    const data = [...item.data];
    const resetBlock = Object.keys(newData).length === 0;
    data[position] = resetBlock
      ? { type: newData.type }
      : { ...item.data[position], ...newData };
    onChange({ ...item, data });
  };
  const removeBlock = (position: number) => {
    const data = [...item.data];
    if (data.length === 1) {
      onRemove();
      // remove row
    } else {
      onRemove(position);
    }
  };

  const columns = Array.from({ length: item?.columns }, (_, i) => i);
  const showSwap = !preview && item?.columns === 2;
  const className = !preview
    ? " border-dotted border-2 border-gray-200 dark:border-gray-700 border-t-0 "
    : "";
  return (
    <div className={"flex-1 relative " + className}>
      {!preview && (
        <LayoutToolbar
          onChange={onChange}
          item={item}
          move={move}
          isPrevRowImageLeft={isPrevRowImageLeft}
        />
      )}
      {showSwap && (
        <Swap
          onClick={() => {
            swapColumns();
          }}
        />
      )}

      <div>
        <div className={"flex flex-col lg:flex-row  h-[calc(80vh)] "}>
          {columns.map((col) => {
            return (
              <Cell
                key={col}
                item={item.data[col]}
                updateBlock={(data) => updateBlock(data, col)}
                removeBlock={() => removeBlock(col)}
                onChange={onChange}
                columns={item.columns}
                preview={preview}
                rowIndex={rowIndex}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
