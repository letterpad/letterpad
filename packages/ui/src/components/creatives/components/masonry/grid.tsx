import { FC } from "react";
import { IoRemoveCircleOutline } from "react-icons/io5";

import { BlockMasonry } from "../../types";
import { Button } from "../../../button";

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
          <Button
            onClick={() => onRemove(item.id)}
            className="absolute top-0 rounded-none px-1 py-1"
            variant="danger"
          >
            <IoRemoveCircleOutline size={20} />
          </Button>
        )}
      </div>
    );
  });

  return (
    <div className="m-auto grid w-full grid-cols-2 gap-0 space-x-2 space-y-2 md:grid-cols-3 lg:grid-cols-4">
      {rows}
    </div>
  );
};
