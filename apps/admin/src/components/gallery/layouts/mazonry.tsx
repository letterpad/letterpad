//@ts-nocheck
import Image from "next/image";

import { ItemPlaceholder } from "@/components/post/components/templates/portfolio/itemPlaceholder";

import { RemoveButton } from "../remove";
import { Item } from "../types";

export const getMasonryLayout = (
  items: Item[],
  onSelect,
  removeItem,
  onSave,
) => {
  const rows = items.map((item, i) => {
    const direction = i % 2 === 0 ? " md:flex-row-reverse" : " md:flex-row";

    if (item.__typename === "GridPlaceholder") {
      return (
        <ItemPlaceholder
          className={direction}
          removeItem={() => removeItem(i)}
          onSave={(data) => onSave(i, data)}
          description={item.description}
          src={item.src}
        />
      );
    }
    const isPortrait = item.aspectRatio < 1;
    const width = isPortrait ? 200 : 1400;
    const height = isPortrait ? 300 : 800;
    const aspect = isPortrait ? "aspect-video" : "aspect-square";
    return (
      <div key={item.src} className="group relative cursor-pointer">
        <Image
          src={item.src as string}
          width={width}
          height={height}
          alt="img"
          layout="responsive"
          objectFit="fill"
          onClick={() => onSelect(i)}
          className={aspect}
        />

        <RemoveButton onClick={() => removeItem(i)} />
      </div>
    );
  });
  return (
    <div className="container m-auto columns-1 gap-8 space-y-8 md:columns-3 lg:columns-3">
      {rows}
    </div>
  );
};
