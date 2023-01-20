import classNames from "classnames";
import { FC, ReactNode } from "react";

import { useBuilderContext } from "../../context/context";
import { Toolbar } from "../../toolbar";
import { LayoutToolbar } from "../../toolbar/layout-toolbar";
import { LayoutToolbarFirstRow } from "../../toolbar/layout-toolbar-first-row";
import { Swap } from "../../toolbar/swap";
import { Block } from "../../types";

export interface RowProps {
  row: Block;
  isPrevRowImageLeft: boolean;
  rowIndex: number;
  children: ReactNode;
}

export const ToolbarProvider: FC<RowProps> = ({
  children,
  row,
  isPrevRowImageLeft,
  rowIndex,
}) => {
  const { updateRow, moveRow, swapColumns, preview } = useBuilderContext();

  const showSwap = !preview && row?.columns === 2;
  const isFirstRow = rowIndex === 0;

  const isFirstRowToolbar = !preview && isFirstRow;
  const isOtherRowToolbar = !preview && !isFirstRow;
  return (
    <div
      className={classNames("relative flex-1 ", {
        "border-2 border-t-0 border-dotted border-gray-200 dark:border-gray-700":
          !preview,
      })}
    >
      {isFirstRowToolbar && (
        <LayoutToolbarFirstRow
          onChange={(block) => updateRow(block, rowIndex)}
          item={row}
        />
      )}
      {isOtherRowToolbar && (
        <LayoutToolbar
          onChange={(block) => updateRow(block, rowIndex)}
          item={row}
          move={(dir) => moveRow(rowIndex, dir)}
          isPrevRowImageLeft={isPrevRowImageLeft}
          rowIndex={rowIndex}
        />
      )}
      {showSwap && (
        <Swap
          onClick={() => {
            swapColumns(rowIndex);
          }}
        />
      )}

      {children}

      {!preview && (
        <div className="align-center flex justify-center">
          <Toolbar rowIndex={rowIndex} />
        </div>
      )}
    </div>
  );
};
