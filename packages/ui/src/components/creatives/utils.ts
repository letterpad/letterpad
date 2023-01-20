import { Block } from "./types";

export const isFirstColumnImageType = (item: Block) =>
  item.data[0]?.type === "image";

export const isSecondColumnImageType = (item: Block) =>
  item.data[1]?.type === "image";

export const mergeTextWithImage = (item: Block): Block => {
  const itemCopy = { ...item };

  if (isFirstColumnImageType(item)) {
    itemCopy.data = [
      {
        type: "image",
        image: item.data[0].image,
        text: item.data[0]?.text ?? item.data[1]?.text,
      },
    ];
  } else if (isSecondColumnImageType(item)) {
    itemCopy.data = [
      {
        type: "image",
        image: item.data[1].image,
        text: item.data[1]?.text || item.data[0]?.text,
      },
    ];
  }
  return { ...itemCopy, columns: 1, id: createId(), cover: "big" };
};

export const resetCellToImageType = (item: Block): Block => {
  return {
    ...item,
    cover: "big",
    data: [
      {
        type: "image",
      },
    ],
  };
};

export const showSplitIcon = (item: Block) => item.columns === 1;

export const showFullSizeIcon = (item: Block) =>
  !showSplitIcon || item.cover === "banner";

export const showBannerIcon = (item: Block) => item.cover !== "banner";

export const splitBlock = (item: Block, firstCellType): Block => {
  let data = [...item.data];
  if (firstCellType === "text") {
    data = [{ type: "text" }, { type: "image" }];
  } else {
    data = [{ type: "image" }, { type: "text" }];
  }
  return {
    data,
    columns: 2,
    id: createId(),
  };
};

export function random(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const createId = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + s4();
};
