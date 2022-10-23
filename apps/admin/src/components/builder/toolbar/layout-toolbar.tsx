import { FC } from "react";

import { createId } from "@/shared/utils";

import {
  IconDown,
  IconFullWidth,
  IconSmallHeight,
  IconSplit,
  IconUp,
} from "./icons";
import { Block } from "../types";
import {
  isFirstColumnImageType,
  isSecondColumnImageType,
  mergeTextWithImage,
  resetCellToImageType,
  showBannerIcon,
  showFullSizeIcon,
  showSplitIcon,
  splitBlock,
} from "../utils";

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
    onChange({
      ...item,
      cover: "banner",
      data: [{ ...item.data[0], type: "text" }],
      columns: 1,
    });
  };

  const onFullWidth = () => {
    if (item.columns === 2) {
      onChange({ ...mergeTextWithImage(item), cover: "big" });
    } else {
      onChange(resetCellToImageType(item));
    }
  };

  const onSplit = () => {
    const firstCellType = isPrevRowImageLeft ? "text" : "image";
    onChange(splitBlock(item, firstCellType));
  };
  const isNotFirstRow = rowIndex != 0;
  const isNotFirstAndSecondrow = rowIndex > 1;

  if (item.columns === 2) {
    return (
      <Wrapper>
        {isNotFirstAndSecondrow && (
          <button
            className="icon-class-1 rounded-l-m"
            onClick={() => move("up")}
          >
            <IconUp size={20} />
          </button>
        )}

        {isNotFirstRow && (
          <button
            className="icon-class-1 rounded-r-md"
            onClick={() => move("down")}
          >
            <IconDown size={20} />
          </button>
        )}
      </Wrapper>
    );
  }
  return (
    <div className="left-1/2  top-10 z-50 flex  justify-center rounded-t-lg  border  border-b-0 border-gray-200 bg-slate-100 p-2 shadow-sm dark:border-gray-800 dark:bg-gray-800">
      {showBannerIcon(item) && (
        <button className="icon-class-1 rounded-md" onClick={onSmallHeight}>
          <IconSmallHeight size={16} />
        </button>
      )}
      {showFullSizeIcon(item) && (
        <button className="icon-class-1 rounded-md" onClick={onFullWidth}>
          <IconFullWidth size={16} />
        </button>
      )}
      {showSplitIcon(item) && (
        <button
          aria-current="page"
          className={"icon-class-1 "}
          onClick={onSplit}
        >
          <IconSplit size={16} />
        </button>
      )}

      {isNotFirstAndSecondrow && (
        <button className="icon-class-1 " onClick={() => move("up")}>
          <IconUp size={20} />
        </button>
      )}

      {isNotFirstRow && (
        <button
          className="icon-class-1 rounded-r-md"
          onClick={() => move("down")}
        >
          <IconDown size={20} />
        </button>
      )}
    </div>
  );
};

const Wrapper = ({ children }) => (
  <div className="left-1/2  top-10 z-50 flex  justify-center rounded-t-lg  border  border-b-0 border-gray-200 bg-slate-100 p-2 shadow-sm dark:border-gray-800 dark:bg-gray-800">
    {children}
  </div>
);
