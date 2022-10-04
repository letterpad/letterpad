import { FC } from "react";

import { IconFullWidth, IconSplit } from "./icons";
import { Block, BlockType } from "../types";

interface Props {
  onChange: (change: Block) => void;
  item: Block;
}
export const LayoutToolbar: FC<Props> = ({ onChange, item }) => {
  return (
    <div className="z-50 inline-flex rounded-md shadow-sm absolute left-1/2 -ml-14 top-10">
      <button
        aria-current="page"
        className="icon-class rounded-l-md"
        onClick={() =>
          onChange({
            ...item,
            data: [...item.data, { type: "text", data: { text: "New Block" } }],
            type: BlockType.Split,
          })
        }
      >
        <IconSplit />
      </button>
      <button
        className="icon-class rounded-r-md"
        onClick={() => onChange({ ...item, type: BlockType.FullWidth })}
      >
        <IconFullWidth />
      </button>
    </div>
  );
};
