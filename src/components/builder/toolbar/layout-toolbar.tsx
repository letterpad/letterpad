import { FC } from "react";

import { IconFullWidth, IconSplit, IconThreeCols } from "./icons";
import { Block } from "../types";

interface Props {
  onChange: (change: Block) => void;
  item: Block;
}
export const LayoutToolbar: FC<Props> = ({ onChange, item }) => {
  return (
    <div className="z-50 inline-flex rounded-md shadow-sm absolute left-1/2 -ml-14 top-10">
      <button
        className="icon-class rounded-l-md"
        onClick={() => onChange({ ...item, columns: 1 })}
      >
        <IconFullWidth />
      </button>
      <button
        aria-current="page"
        className="icon-class"
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
      <button
        aria-current="page"
        className="icon-class rounded-r-md"
        onClick={() =>
          onChange({
            ...item,
            data: [...item.data, {}, {}],
            columns: 3,
          })
        }
      >
        <IconThreeCols />
      </button>
    </div>
  );
};
