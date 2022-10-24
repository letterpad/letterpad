import { FC } from "react";

import { Row } from "@/components/builder/layouts/story-builder";

import { PageType } from "@/graphql/types";

import { useBuilderContext } from "./context";
import { Toolbar } from "./toolbar";
import { EditSwitch } from "./toolbar/editSwitch";
import { IconEye, IconTools } from "./toolbar/icons";

interface Props {
  type: PageType;
  editable?: boolean;
}

export const Layout: FC<Props> = ({ editable = true }) => {
  const { preview, grid } = useBuilderContext();
  return (
    <div id="creative">
      {editable && <EditSwitch />}
      <div className="flex flex-col">
        {grid.map((row, rowIndex) => {
          const isPrevRowImageLeft =
            grid[rowIndex - 1]?.data[0]?.type === "image";
          return (
            <>
              <Row
                isPrevRowImageLeft={isPrevRowImageLeft}
                row={row}
                key={row.id}
                rowIndex={rowIndex}
              />
              {!preview && (
                <div className="align-center flex justify-center">
                  <Toolbar rowIndex={rowIndex} />
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};
