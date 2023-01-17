import { FC, ReactChild } from "react";

import { Row } from "./components";
import { useBuilderContext } from "./context/context";
import { EditSwitch } from "./toolbar/editSwitch";
import { BlockItem } from "./types";

interface Props {
  type: BlockItem["type"];
  editable?: boolean;
  head: ReactChild;
}

export const Layout: FC<Props> = ({ editable = true, head }) => {
  const { grid } = useBuilderContext();
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
              <Row
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
export default Layout;
