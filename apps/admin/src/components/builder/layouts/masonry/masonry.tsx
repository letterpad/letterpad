//@ts-nocheck
import Image from "next/image";

import { RemoveButton } from "@/components/gallery/remove";
import { ItemPlaceholder } from "@/components/post/components/templates/portfolio/itemPlaceholder";

import { BlockMasonry } from "../../types";

export const getMasonryLayout = (
  items: BlockMasonry[],
  onSelect,
  removeItem,
  onSave,
  preview,
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

        {!preview && <RemoveButton onClick={() => removeItem(item.id)} />}
      </div>
    );
  });
  return (
    <div className="m-auto w-full columns-1 gap-2 md:columns-3 lg:columns-4">
      {rows}
    </div>
  );
};
