import { FC } from "react";

import { createId } from "@/shared/utils";

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
  const onSmallHeight = () => {
    onChange({ ...item, cover: "banner" });
  };

  const onFullWidth = () => {
    const mergeItem: Block = { columns: 1, data: [], id: createId() };

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
      id: createId(),
    });
  };
  return (
    <div className="left-1/2  top-10 z-50 flex  justify-center rounded-t-lg  border  border-b-0 border-gray-200 bg-slate-100 p-2 shadow-sm dark:border-gray-800 dark:bg-gray-800">
      <button className="icon-class rounded-l-md" onClick={onSmallHeight}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-grid-3x2"
          viewBox="0 0 16 16"
        >
          <path d="M 0 3.5 A 1.5 1.5 0 0 1 1.5 2 h 13 A 1.5 1.5 0 0 1 16 3.5 v 8 a 1.5 1.5 0 0 1 -1.5 1.5 h -13 A 1.5 1.5 0 0 1 0 11.5 v -8 z M 1.5 3 a 0.5 0.5 0 0 0 -0.5 0.5 V 8 h 4 V 3 Z H 1.5 z M 5 8 H 1 v 3.5 a 0.5 0.5 0 0 0 0.5 0.5 H 6 V 8 z m 1 0 v 4 h 5 V 8 z m 4 -1 V 3 H 5 v 5 h 5 z m 1 1 v 4 h 3.5 a 0.5 0.5 0 0 0 0.5 -0.5 V 8 h -5 z m 0 0 h 4 V 3.5 a 0.5 0.5 0 0 0 -0.5 -0.5 H 10 v 5 z" />
        </svg>
      </button>
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
