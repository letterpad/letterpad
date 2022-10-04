import { FC } from "react";

import { BlockItem } from "./blockItem";
import { LayoutToolbar } from "../../toolbar/layout-toolbar";
import { Block, BlockType } from "../../types";

export interface PlaceholderProps {
  item: Block;
  onChange: (change: Block) => void;
  move: (dir: "up" | "down", index: number) => void;
}
export const Placeholder: FC<PlaceholderProps> = ({ item, onChange, move }) => {
  const updateImage = (image, position = 0) => {
    const data = [...item.data];
    data[position] = {
      type: "image",
      data: image,
    };
    onChange({ ...item, data });
  };
  const updateText = (newData, position = 0) => {
    const data = [...item.data];
    data[position] = {
      type: "text",
      data: newData,
    };
    onChange({ ...item, data });
  };
  const type = item.type;

  return (
    <div className="flex-1 relative" key={type}>
      <LayoutToolbar onChange={onChange} item={item} />
      {type === BlockType.Split && (
        <div>
          <div className="flex flex-row h-[calc(80vh)]">
            <BlockItem
              item={item.data[0]}
              updateImage={(img) => updateImage(img, 0)}
              updateText={(data) => updateText(data, 0)}
              onChange={onChange}
              columns={2}
              move={(dir) => move(dir, 0)}
            />
            <BlockItem
              item={item.data[1]}
              updateImage={(img) => updateImage(img, 1)}
              updateText={(data) => updateText(data, 0)}
              onChange={onChange}
              columns={2}
              move={(dir) => move(dir, 1)}
            />
          </div>
        </div>
      )}
      {type === BlockType.FullWidth && (
        <div className="flex flex-row h-[calc(80vh)] w-full">
          <BlockItem
            item={item.data[0]}
            updateImage={(img) => updateImage(img, 0)}
            updateText={(data) => updateText(data, 0)}
            onChange={onChange}
            columns={1}
            move={(dir) => move(dir, 0)}
          />
        </div>
      )}
    </div>
  );
};
