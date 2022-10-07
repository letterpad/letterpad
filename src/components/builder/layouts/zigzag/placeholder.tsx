import { FC } from "react";

import { BlockItem } from "./blockItem";
import { LayoutToolbar } from "../../toolbar/layout-toolbar";
import { Block, BlockItem as BlockData } from "../../types";

export interface PlaceholderProps {
  item: Block;
  onChange: (change: Block) => void;
  move: (dir: "up" | "down", index: number) => void;
  preview: boolean;
}
export const Placeholder: FC<PlaceholderProps> = ({
  item,
  onChange,
  move,
  preview,
}) => {
  const updateBlock = (newData: BlockData, position = 0) => {
    const data = [...item.data];
    const resetBlock = Object.keys(newData).length === 0;
    data[position] = resetBlock ? {} : { ...item.data[position], ...newData };
    onChange({ ...item, data });
  };
  const columns = Array.from({ length: item.columns }, (_, i) => i);

  return (
    <div className="flex-1 relative">
      {!preview && <LayoutToolbar onChange={onChange} item={item} />}

      <div>
        <div className={"flex flex-col lg:flex-row  h-[calc(80vh)] gap-3"}>
          {columns.map((col) => {
            return (
              <BlockItem
                key={col}
                item={item.data[col]}
                updateBlock={(data) => updateBlock(data, col)}
                onChange={onChange}
                columns={item.columns}
                move={(dir) => move(dir, col)}
                preview={preview}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
