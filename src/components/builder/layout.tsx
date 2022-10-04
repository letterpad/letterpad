import { FC, useState } from "react";

import { PlaceholderProps } from "./layouts/zipzag/placeholder";
import { Block, BlockType } from "./types";

const getImage = (i) => {
  const isPortrait = random(0, 1) === 1;
  const width = isPortrait ? 800 : 1400;
  const height = isPortrait ? 1400 : 800;
  return `https://picsum.photos/${width}/${height}/?random=` + i;
};
const data = [
  {
    type: BlockType.Split,
    data: [
      {
        type: "text",
        data: {
          text: "Hello World",
        },
      },
      {
        type: "image",
        data: {
          src: getImage(1),
        },
      },
    ],
  },

  {
    type: BlockType.FullWidth,
    data: [
      {
        type: "image",
        data: {
          src: getImage(5),
        },
      },
    ],
  },
  {
    type: BlockType.Split,
    data: [
      {
        type: "image",
        data: {
          src: getImage(0),
        },
      },
      {
        type: "image",
        data: {
          src: getImage(2),
        },
      },
    ],
  },
];

interface Props {
  Placeholder: React.ComponentType<PlaceholderProps>;
  onChange: () => null;
}

const defaultItem: Block = {
  type: BlockType.FullWidth,
  data: [{ type: "text", data: { text: "Hello World" } }],
};

export const Layout: FC<Props> = ({ Placeholder, onChange }) => {
  const [grid, setGrid] = useState<Block[]>(data);

  const addBlock = () => {
    setGrid((grid) => [...grid, defaultItem]);
  };

  const updateGrid = (change, index: number) => {
    const newGrid = grid.map((item, idx) => {
      return idx === index ? change : item;
    });
    setGrid(newGrid);
    console.log(newGrid);
    // onChange(newGrid);
  };

  return (
    <>
      <div className="site-layout-background" style={{ padding: 24 }}>
        <div className="flex flex-col">
          {grid.map((item, i) => {
            return (
              <Placeholder
                item={item}
                key={i}
                onChange={(block) => updateGrid(block, i)}
                move={(dir, position) => {
                  const gridCopy = [...grid];
                  const temp = gridCopy[i].data[position];

                  const hasImmediatePrev =
                    position === 1 && gridCopy[i].data[position - 1];
                  const prevBlock = gridCopy[i - 1];

                  const prev = hasImmediatePrev
                    ? [i, 0]
                    : prevBlock && [i - 1, prevBlock.data.length === 2 ? 1 : 0];

                  const hasImmediateNext =
                    position === 0 && gridCopy[i].data[position + 1];
                  const nextBlockChild = gridCopy[i + 1]?.data[0];

                  const next = hasImmediateNext
                    ? [i, 1]
                    : nextBlockChild
                    ? [i + 1, 0]
                    : null;

                  if (dir === "up" && prev) {
                    gridCopy[i].data[position] =
                      gridCopy[prev[0]].data[prev[1]];
                    gridCopy[prev[0]].data[prev[1]] = temp;
                  } else if (next) {
                    gridCopy[i].data[position] =
                      gridCopy[next[0]].data[next[1]];
                    gridCopy[next[0]].data[next[1]] = temp;
                  }
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
