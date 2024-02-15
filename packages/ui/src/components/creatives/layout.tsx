import { FC } from "react";

import { EditableRow, Row } from "./components/row";
import { useBuilderContext } from "./context/context";
import { EditSwitch } from "./toolbar/editSwitch";

interface Props {
  editable?: boolean;
}

export const Layout: FC<Props> = ({ editable = true }) => {
  const { grid, preview } = useBuilderContext();
  const RowComponent = preview ? Row : EditableRow;
  return (
    <>
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
