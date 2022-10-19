import { FC } from "react";

import { IconDown, IconFullWidth, IconSplit, IconUp } from "./icons";
import { Block } from "../types";

interface Props {
  onChange: (change: Block) => void;
  item: Block;
  move: (dir: "up" | "down") => void;
  isPrevRowImageLeft: boolean;
  rowIndex: number;
}
export const LayoutToolbar: FC<Props> = ({
  onChange,
  item,
  move,
  isPrevRowImageLeft,
  rowIndex,
}) => {
  const onFullWidth = () => {
    const mergeItem: Block = { columns: 1, data: [] };
    if (item.data[0].type === "image") {
      mergeItem.data = [
        {
          type: "image",
          image: item.data[0].image,
          text: item.data[0]?.text ?? item.data[1]?.text,
        },
      ];
    } else if (item.data[1].type === "image") {
      mergeItem.data = [
        {
          type: "image",
          image: item.data[1].image,
          text: item.data[1]?.text || item.data[0]?.text,
        },
      ];
    }
    onChange({ ...mergeItem, columns: 1 });
  };

  const onSplit = () => {
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
  };
  return (
    <div className="left-1/2  top-10 z-50 flex  justify-center rounded-t-lg  border  border-b-0 border-gray-200 bg-slate-100 p-2 shadow-sm dark:border-gray-800 dark:bg-gray-800">
      <button className="icon-class rounded-l-md" onClick={onFullWidth}>
        <IconFullWidth />
      </button>
      <button aria-current="page" className={"icon-class "} onClick={onSplit}>
        <IconSplit />
      </button>

      {rowIndex === 0 && (
        <>
          <button
            className="icon-class"
            onClick={() => {
              onChange({
                ...item,
                cover: "small",
                columns: 1,
                data: [item.data[0]],
              });
            }}
          >
            Cover Small
          </button>
          <button
            className="icon-class rounded-r-md"
            onClick={() => {
              onChange({
                ...item,
                cover: "big",
                columns: 1,
                data: [item.data[0]],
              });
            }}
          >
            Cover Big
          </button>
        </>
      )}
      {rowIndex > 1 && (
        <button className="icon-class " onClick={() => move("up")}>
          <IconUp />
        </button>
      )}
      {rowIndex > 0 && (
        <button
          className="icon-class rounded-r-md"
          onClick={() => move("down")}
        >
          <IconDown />
        </button>
      )}
    </div>
  );
};
