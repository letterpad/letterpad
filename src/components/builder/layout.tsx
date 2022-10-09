import { FC } from "react";

import { Button } from "@/components_v2/button";

import { useBuilderContext } from "./context";
import { PlaceholderProps } from "./layouts/zigzag/row";
import { IconAdd, IconClose } from "./toolbar/icons";
import { Block } from "./types";

interface Props {
  Row: React.ComponentType<PlaceholderProps>;
  onChange: (block: Block[]) => void;
  data: { rows: Block[] };
  type: string;
}

export const Layout: FC<Props> = ({ Row }) => {
  const { preview, setPreview, grid, addRow } = useBuilderContext();

  return (
    <div style={{ padding: 24 }} id="creative">
      <button onClick={() => setPreview(!preview)}>Toggle</button>
      <div className="flex flex-col gap-4">
        {grid.map((item, i) => {
          const isPrevRowImageLeft = grid[i - 1]?.data[0]?.type === "image";
          return (
            <Row
              isPrevRowImageLeft={isPrevRowImageLeft}
              item={item}
              key={i}
              rowIndex={i}
            />
          );
        })}
      </div>
      <div className="flex align-center justify-center">
        <Button type="dark" onClick={addRow}>
          <IconAdd />
        </Button>
      </div>
    </div>
  );
};
