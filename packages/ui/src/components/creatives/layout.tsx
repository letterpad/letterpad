import { FC, ReactChild } from "react";

import { EditableRow, Row } from "./components/row";
import { useBuilderContext } from "./context/context";
import { EditSwitch } from "./toolbar/editSwitch";
import { BlockItem } from "./types";

interface Props {
  editable?: boolean;
  head: ReactChild;
}

export const Layout: FC<Props> = ({ editable = true, head }) => {
  const { grid, preview } = useBuilderContext();
  const RowComponent = preview ? Row : EditableRow;
  return (
    <>
      {head}
      <div id="creative">
        {editable && (
          <div className="flex justify-end p-4">
            <EditSwitch />
          </div>
        )}
        <div className="flex flex-col">
          {grid.map((row, rowIndex) => {
            const isPrevRowImageLeft =
              grid[rowIndex - 1]?.data[0]?.type === "image";
            return (
              <RowComponent
                isPrevRowImageLeft={isPrevRowImageLeft}
                row={row}
                key={row.id}
                rowIndex={rowIndex}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
