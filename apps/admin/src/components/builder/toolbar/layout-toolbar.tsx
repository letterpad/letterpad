import { FC } from "react";

import {
  IconDown,
  IconFullWidth,
  IconSmallHeight,
  IconSplit,
  IconUp,
} from "./icons";
import { Block } from "../types";
import {
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
            className="icon-class-1 rounded-l-m p-0"
            onClick={() => move("up")}
          >
            <IconUp size={24} />
          </button>
        )}

        {isNotFirstRow && (
          <button
            className="icon-class-1 rounded-r-md p-0"
            onClick={() => move("down")}
          >
            <IconDown size={24} />
          </button>
        )}
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      {showBannerIcon(item) && (
        <button
          className="icon-class-1 rounded-md p-0 text-xl"
          onClick={onSmallHeight}
        >
          A
        </button>
      )}
      {showFullSizeIcon(item) && (
        <button className="icon-class-1 rounded-md p-0" onClick={onFullWidth}>
          <IconFullWidth size={20} />
        </button>
      )}
      {showSplitIcon(item) && (
        <button
          aria-current="page"
          className={"icon-class-1 p-0 "}
          onClick={onSplit}
        >
          <IconSplit size={24} />
        </button>
      )}

      {isNotFirstAndSecondrow && (
        <button className="icon-class-1 p-0 " onClick={() => move("up")}>
          <IconUp size={24} />
        </button>
      )}

      {isNotFirstRow && (
        <button
          className="icon-class-1 rounded-r-md p-0"
          onClick={() => move("down")}
        >
          <IconDown size={24} />
        </button>
      )}
    </Wrapper>
  );
};

const Wrapper = ({ children }) => (
  <div className="top-10 left-1/2  z-50 flex items-center  justify-center gap-8   rounded-t-lg border-b border-gray-200 bg-slate-100 p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    {children}
  </div>
);
