import { FC } from "react";

import { Row } from "@/components/builder/layouts/story-builder";

import { PageType } from "@/graphql/types";

import { useBuilderContext } from "./context";
import { EditSwitch } from "./toolbar/editSwitch";

interface Props {
  type: PageType;
  editable?: boolean;
}

export const Layout: FC<Props> = ({ editable = true }) => {
  const { grid } = useBuilderContext();
  return (
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
  );
};
export default Layout;
