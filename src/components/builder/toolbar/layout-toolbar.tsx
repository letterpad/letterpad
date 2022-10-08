import { FC } from "react";

import { IconDown, IconFullWidth, IconSplit, IconUp } from "./icons";
import { Block } from "../types";

interface Props {
  onChange: (change: Block) => void;
  item: Block;
  move: (dir: "up" | "down") => void;
  isPrevRowImageLeft: boolean;
}
export const LayoutToolbar: FC<Props> = ({
  onChange,
  item,
  move,
  isPrevRowImageLeft,
}) => {
  return (
    <div className="p-2  z-50 flex justify-center  rounded-t-lg shadow-sm  left-1/2  top-10 bg-slate-100 dark:bg-gray-800 border-gray-200 dark:border-gray-800 border border-b-0">
      <button
        className="icon-class rounded-l-md"
        onClick={() => {
          const mergeItem: Block = { columns: 1, data: [] };
          if (item.data[0].type === "image") {
            mergeItem.data = [
              {
                type: "image",
                image: item.data[0].image,
                text: item.data[1].text,
              },
            ];
          } else if (item.data[1].type === "image") {
            mergeItem.data = [{ type: "image", image: item.data[1].image }];
          }
          onChange({ ...item, columns: 1 });
        }}
      >
        <IconFullWidth />
      </button>
      <button
        aria-current="page"
        className="icon-class "
        onClick={() => {
          let data = [...item.data];
          if (isPrevRowImageLeft) {
            data = [{ type: "text" }, { ...data[0], type: "image" }];
          } else {
            data = [{ ...data[0], type: "image" }, { type: "text" }];
          }

          onChange({
            data,
            columns: 2,
          });
        }}
      >
        <IconSplit />
      </button>
      <button className="icon-class " onClick={() => move("up")}>
        <IconUp />
      </button>
      <button className="icon-class rounded-r-md" onClick={() => move("down")}>
        <IconDown />
      </button>
    </div>
  );
};
