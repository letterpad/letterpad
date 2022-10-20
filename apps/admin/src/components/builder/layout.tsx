import { FC } from "react";

import { Button } from "@/components_v2/button";

import { PageType } from "@/graphql/types";

import { useBuilderContext } from "./context";
import { PlaceholderProps } from "./layouts/story-builder/row";
import { IconAdd } from "./toolbar/icons";
import { Block } from "./types";

interface Props {
  Row: React.ComponentType<PlaceholderProps>;
  data: { rows: Block[] };
  type: PageType;
}

export const Layout: FC<Props> = ({ Row }) => {
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
              key={i}
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
