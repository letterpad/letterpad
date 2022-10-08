import { FC } from "react";

import { IconFullWidth, IconSplit, IconThreeCols } from "./icons";
import { Block } from "../types";

interface Props {
  onChange: (change: Block) => void;
  item: Block;
}
export const LayoutToolbar: FC<Props> = ({ onChange, item }) => {
  return (
    <div className="p-2  z-50 flex justify-center  rounded-t-lg shadow-sm  left-1/2  top-10 bg-slate-100 dark:bg-gray-800 border-gray-200 dark:border-gray-800 border border-b-0">
      <button
        className="icon-class rounded-l-md"
        onClick={() => onChange({ ...item, columns: 1 })}
      >
        <IconFullWidth />
      </button>
      <button
        aria-current="page"
        className="icon-class rounded-r-md"
        onClick={() =>
          onChange({
            ...item,
            data: [...item.data, {}, {}],
            columns: 2,
          })
        }
      >
        <IconSplit />
      </button>
    </div>
  );
};
