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
    return (
      <div
        key={item.src}
        className="group relative aspect-square cursor-pointer"
      >
        <Image
          src={item.src as string}
          alt="img"
          layout="fill"
          objectFit="cover"
          onClick={() => onSelect(i)}
        />
        {!preview && <RemoveButton onClick={() => onRemove(item.id)} />}
      </div>
    );
  });

  return (
    <div className="m-auto grid w-full grid-cols-2 gap-0 space-x-2 space-y-2 md:grid-cols-3 lg:grid-cols-4">
      {rows}
    </div>
  );
};
