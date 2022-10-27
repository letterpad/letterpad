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
      {editable && <EditSwitch />}
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
      <div
        data-type="portal"
        id="modal-creatives"
        className="absolute top-0 left-0 z-10"
      ></div>
    </div>
  );
};
