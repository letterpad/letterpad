import { FC, useEffect } from "react";

import { createId } from "@/shared/utils";

import { getHeight, Wrapper } from "./wrapper";
import { getMasonryLayout } from "../masonry/masonry";
import { useBuilderContext } from "../../context";
import { BlockItem, BlockMasonry } from "../../types";
import { random } from "../../utils";

interface Props {
  columns: number;
  item: BlockItem;
  position: [number, number];
  formats: string;
  setEditorOpen: any;
  cover?: "small" | "big" | "banner";
}

// const block: BlockItem = {
//   type: "masonry",
//   masonry: Array.from({ length: 6 }, (_, i) => {
//     const isPortrait = random(0, 1) === 1;
//     const width = isPortrait ? 800 : 1400;
//     const height = isPortrait ? 1400 : 800;
//     const data = {
//       src: `https://picsum.photos/${width}/${height}/?random=` + i,
//       aspectRatio: isPortrait ? 9 / 16 : 16 / 9,
//       description: `In publishing and graphic design, Lorem ipsum is a placeholder
//                   text commonly used to demonstrate the visual form of a document
//                   or a typeface without relying on meaningful content.`,
//       alt: "",
//       title: "",
//       index: createId(),
//     };

//     return data;
//   }),
// };

export const SectionMasonry: FC<Props> = ({
  columns,
  item,
  position,
  formats,
  cover,
}) => {
  const { updateCell, preview } = useBuilderContext();
  const [rowIndex, colIndex] = position;

  if (item.type === "image") return null;

  const reorder = (arr: BlockMasonry[], columns: number) => {
    const cols = columns;
    const out: BlockMasonry[] = [];
    let col = 0;
    while (col < cols) {
      for (let i = 0; i < arr.length; i += cols) {
        let _val = arr[i + col];
        if (_val !== undefined) out.push(_val);
      }
      col++;
    }
    return out;
  };

  const update = (data: BlockMasonry[]) => {
    updateCell(
      {
        type: "masonry",
        masonry: data,
      },
      rowIndex,
      colIndex,
    );
  };
  if (!item.masonry) return null;

  const grid = getMasonryLayout(
    reorder(item.masonry, 4) ?? [],
    () => {},
    (id) => {
      const newData = item.masonry?.filter((item) => item.id !== id);
      if (newData) update(newData);
    },
    () => {},
    preview,
  );

  return <Wrapper className={`row-${rowIndex} lg:py-0`}>{grid}</Wrapper>;
};
