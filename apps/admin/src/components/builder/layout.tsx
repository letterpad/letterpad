import { FC, useState } from "react";

import { Row } from "@/components/builder/layouts/story-builder";

import { PageType } from "@/graphql/types";

import { useBuilderContext } from "./context";
import { Toolbar } from "./toolbar";
import { Block } from "./types";

interface Props {
  data: { rows: Block[] };
  type: PageType;
}

export const Layout: FC<Props> = () => {
  const { preview, setPreview, grid } = useBuilderContext();
  return (
    <div style={{ padding: 24 }} id="creative">
      <button onClick={() => setPreview(!preview)}>Toggle</button>
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
