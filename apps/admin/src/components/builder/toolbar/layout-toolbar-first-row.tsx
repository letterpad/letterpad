import classNames from "classnames";
import { FC } from "react";

import { createId } from "@/shared/utils";

import { IconDown, IconFullWidth, IconSplit, IconUp } from "./icons";
import { Block } from "../types";

interface Props {
  onChange: (change: Block) => void;
  item: Block;
}
export const LayoutToolbarFirstRow: FC<Props> = ({ onChange, item }) => {
  const isActive = (cover: Block["cover"]) => item.cover === cover;
  return (
    <div
      className={classNames(
        "left-1/2  top-10 z-50 flex  justify-center rounded-t-lg  border-b  border-solid border-gray-200 bg-slate-100 p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800",
      )}
    >
      <button
        className={classNames("icon-class rounded-md", {
          hidden: isActive("small"),
        })}
        onClick={() => {
          onChange({
            ...item,
            cover: "small",
            columns: 1,
            data: [item.data[0]],
          });
        }}
      >
        Small Cover Image
      </button>
      <button
        className={classNames("icon-class rounded-md ", {
          hidden: isActive("big"),
        })}
        onClick={() => {
          onChange({
            ...item,
            cover: "big",
            columns: 1,
            data: [item.data[0]],
          });
        }}
      >
        Big Cover Image
      </button>
    </div>
  );
};
