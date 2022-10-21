import { FC } from "react";

import { Row } from "@/components/builder/layouts/story-builder";
import { Button } from "@/components_v2/button";

import { PageType } from "@/graphql/types";

import { useBuilderContext } from "./context";
import { IconAdd } from "./toolbar/icons";
import { Block } from "./types";

interface Props {
  data: { rows: Block[] };
  type: PageType;
}

export const Layout: FC<Props> = () => {
  const { preview, setPreview, grid, addRow } = useBuilderContext();

  return (
    <div style={{ padding: 24 }} id="creative">
      <button onClick={() => setPreview(!preview)}>Toggle</button>
      <div className="flex flex-col gap-4">
        {grid.map((row, i) => {
          const isPrevRowImageLeft = grid[i - 1]?.data[0]?.type === "image";
          return (
            <Row
              isPrevRowImageLeft={isPrevRowImageLeft}
              row={row}
              key={row.id}
              rowIndex={i}
            />
          );
        })}
      </div>
      <div className="align-center flex justify-center">
        <Button type="dark" onClick={addRow}>
          <IconAdd />
        </Button>
      </div>
    </div>
  );
};
