import { FC, useState } from "react";

import { PlaceholderProps } from "./layouts/zigzag/placeholder";
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
}

const defaultItem: Block = {
  columns: 3,
  data: [
    {
      text: "Hello World",
    },
  ],
};

export const Layout: FC<Props> = ({ Placeholder, onChange }) => {
  const [grid, setGrid] = useState<Block[]>(data);
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

  return (
    <>
      <div className="" style={{ padding: 24 }}>
        <button onClick={() => setPreview(!preview)}>Toggle</button>
        <div className="flex flex-col gap-4">
          {grid.map((item, i) => {
            return (
              <Placeholder
                preview={preview}
                item={item}
                key={i}
                onChange={(block) => updateGrid(block, i)}
                move={(dir, position) => {
                  const gridCopy = moveGridItem(grid, i, position, dir);
                  setGrid(gridCopy);
                }}
              />
            );
          })}
        </div>
        <div className="flex align-center justify-center">
          <button
            className="bg-white p-2 rounded text-black"
            onClick={addBlock}
          >
            Add
          </button>
        </div>
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
