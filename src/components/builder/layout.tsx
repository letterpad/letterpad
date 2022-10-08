import { FC, useState } from "react";

import { Button } from "@/components_v2/button";
import { Drawer } from "@/components_v2/drawer";

import { PlaceholderProps } from "./layouts/zigzag/placeholder";
import { IconAdd, IconClose } from "./toolbar/icons";
import { Block } from "./types";

const getImage = (i) => {
  const isPortrait = random(0, 1) === 1;
  const width = isPortrait ? 800 : 1400;
  const height = isPortrait ? 1400 : 800;
  return `https://picsum.photos/${width}/${height}/?random=` + i;
};
const data = [
  {
    columns: 2,
    data: [
      {},
      {
        text: "Hello World",
        image: {
          src: getImage(1),
        },
      },
    ],
  },
  {
    columns: 2,
    data: [
      {
        image: {
          src: getImage(5),
        },
      },
      {
        text: "Another Day",
      },
    ],
  },
  {
    columns: 2,
    data: [
      {
        image: {
          src: getImage(0),
        },
      },
      {
        image: {
          src: getImage(2),
        },
      },
    ],
  },
];

interface Props {
  Placeholder: React.ComponentType<PlaceholderProps>;
  onChange: (block: Block[]) => void;
  data: { rows: Block[] };
  type: string;
}

const defaultItem: Block = {
  columns: 1,
  data: [
    {
      text: "",
    },
  ],
};

export const Layout: FC<Props> = ({ Placeholder, onChange, data, type }) => {
  const [grid, setGrid] = useState<Block[]>(data.rows);
  const [preview, setPreview] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
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
    if (col && gridCopy[index].columns > 1) {
      gridCopy[index].columns -= 1;
      delete gridCopy[index].data[col];
    } else {
      gridCopy = gridCopy.filter((_, idx) => idx !== index);
      // delete gridCopy[index];
    }
    setGrid(gridCopy);
    onChange(gridCopy);
  };
  const className = showConfig
    ? "w-[calc(80vw)] transition-all transition-duration-500"
    : "transition-all";
  return (
    <>
      <div className={className} style={{ padding: 24 }}>
        <button onClick={() => setPreview(!preview)}>Toggle</button>
        <div className="flex flex-col gap-4">
          {grid.map((item, i) => {
            return (
              <Placeholder
                preview={preview}
                item={item}
                key={i}
                onChange={(block) => updateGrid(block, i)}
                onRemove={(col) => removeBlock(i, col)}
                move={(dir, position) => {
                  const gridCopy = moveGridItem(grid, i, position, dir);
                  setGrid(gridCopy);
                }}
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
      <div>
        <div className="text-center">
          {/* <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            type="button"
            onClick={() => setShowConfig(!showConfig)}
          >
            Show drawer
          </button> */}
        </div>
        <Drawer
          show={showConfig}
          onClose={() => setShowConfig(false)}
          title="Theme"
        >
          hello
        </Drawer>
      </div>
    </>
  );
};

function random(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function moveGridItem(grid: Block[], rowIndex, colIndex, dir) {
  const gridCopy = [...grid];

  const current = gridCopy[rowIndex].data[colIndex];
  const prevRow = gridCopy[rowIndex - 1];
  const prevRowLastItem = prevRow?.data[prevRow.data.length - 1];
  const nextRow = gridCopy[rowIndex + 1];
  const nextRowFirstItem = nextRow?.data[0];

  if (dir === "up") {
    if (colIndex > 0) {
      const target = gridCopy[rowIndex].data[colIndex - 1];
      gridCopy[rowIndex].data[colIndex] = target;
      gridCopy[rowIndex].data[colIndex - 1] = current;
    }
    if (colIndex === 0 && prevRowLastItem) {
      gridCopy[rowIndex].data[colIndex] = prevRowLastItem;
      gridCopy[rowIndex - 1].data[prevRow.data.length - 1] = current;
    }
  } else if (dir === "down") {
    if (colIndex < gridCopy[rowIndex].columns - 1) {
      const target = gridCopy[rowIndex].data[colIndex + 1];
      gridCopy[rowIndex].data[colIndex] = target;
      gridCopy[rowIndex].data[colIndex + 1] = current;
    }
    if (colIndex === gridCopy[rowIndex].columns - 1 && nextRowFirstItem) {
      gridCopy[rowIndex].data[colIndex] = nextRowFirstItem;
      gridCopy[rowIndex + 1].data[0] = current;
    }
  }
  return gridCopy;
}
