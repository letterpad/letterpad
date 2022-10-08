import { FC, useState } from "react";

import { Button } from "@/components_v2/button";

import { PlaceholderProps } from "./layouts/zigzag/row";
import { IconAdd, IconClose } from "./toolbar/icons";
import { Block } from "./types";

interface Props {
  Row: React.ComponentType<PlaceholderProps>;
  onChange: (block: Block[]) => void;
  data: { rows: Block[] };
  type: string;
}

const defaultItem: Block = {
  columns: 1,
  data: [
    {
      text: "",
      type: "image",
    },
  ],
};

export const Layout: FC<Props> = ({ Row, onChange, data, type }) => {
  const [grid, setGrid] = useState<Block[]>(data.rows);
  const [preview, setPreview] = useState(false);
  const addBlock = () => {
    setGrid((grid) => [...grid, defaultItem]);
  };

  const updateGrid = (change: Block, index: number) => {
    const newGrid = grid.map((item, idx) => {
      return idx === index ? change : item;
    });
    setGrid(newGrid);
    onChange(newGrid);
  };

  const removeBlock = (index: number, col?: number) => {
    let gridCopy = [...grid];
    if (typeof col !== "undefined" && gridCopy[index].columns > 1) {
      gridCopy[index].columns -= 1;
      delete gridCopy[index].data[col];
    } else {
      gridCopy = gridCopy.filter((_, idx) => idx !== index);
    }
    setGrid(gridCopy);
    onChange(gridCopy);
  };

  return (
    <>
      <div style={{ padding: 24 }} id="creative">
        <button onClick={() => setPreview(!preview)}>Toggle</button>
        <div className="flex flex-col gap-4">
          {grid.map((item, i) => {
            const isPrevRowImageLeft = grid[i - 1]?.data[0]?.type === "image";
            return (
              <Row
                isPrevRowImageLeft={isPrevRowImageLeft}
                preview={preview}
                item={item}
                key={i}
                onChange={(block) => updateGrid(block, i)}
                onRemove={(col) => removeBlock(i, col)}
                move={(dir) => {
                  const gridCopy = moveGridRow(grid, i, dir);
                  setGrid(gridCopy);
                }}
                swapColumns={() => {
                  const gridCopy = [...grid];
                  const current = gridCopy[i].data;
                  gridCopy[i].data = current.reverse();
                  setGrid(gridCopy);
                  onChange(gridCopy);
                }}
                rowIndex={i}
              />
            );
          })}
        </div>
        <div className="flex align-center justify-center">
          <Button type="dark" onClick={addBlock}>
            <IconAdd />
          </Button>
        </div>
      </div>
    </>
  );
};

function moveGridRow(grid: Block[], rowIndex, dir) {
  const gridCopy = [...grid];

  if (dir === "up") {
    if (rowIndex === 0) return gridCopy;
    const temp = gridCopy[rowIndex - 1];
    gridCopy[rowIndex - 1] = gridCopy[rowIndex];
    gridCopy[rowIndex] = temp;
  } else if (dir === "down") {
    if (rowIndex === grid.length - 1) return gridCopy;
    const temp = gridCopy[rowIndex + 1];
    gridCopy[rowIndex + 1] = gridCopy[rowIndex];
    gridCopy[rowIndex] = temp;
  }
  return gridCopy;
}
