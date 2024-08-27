import { FC } from "react";
import { RiDeleteBin4Fill } from "react-icons/ri";

import { BlockMasonry } from "../../types";

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
        <img
          src={item.src as string}
          alt={item.caption}
          style={{ objectFit: "cover", height: "100%" }}
          onClick={() => onSelect(i)}
        />
        {!preview && (
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-0 rounded-full h-10 w-10 flex items-center justify-center right-0 p-1 m-2 backdrop-brightness-50"
          >
            <RiDeleteBin4Fill size={16}/>
          </button>
        )}
      </div>
    );
  });

  return (
    <div className="m-auto grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {rows}
    </div>
  );
};
