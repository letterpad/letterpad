import Image from "next/image";
import { FC } from "react";

import { RemoveButton } from "@/components/gallery/remove";

import { BlockMasonry } from "../../../types";

interface Props {
  items: BlockMasonry[];
  onSelect: (index: number) => void;
  onRemove: (id: string) => void;
  preview: boolean;
}
export const MasonryGrid: FC<Props> = ({
  items,
  onSelect,
  onRemove,
  preview,
}) => {
  const rows = items.map((item, i) => {
    const isPortrait = item.aspectRatio && item.aspectRatio < 1;
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

        {!preview && <RemoveButton onClick={() => onRemove(item.id)} />}
      </div>
    );
  });
  return (
    <div className="m-auto w-full columns-1 gap-2 md:columns-3 lg:columns-4">
      {rows}
    </div>
  );
};
