import { FC, useEffect, useState } from "react";

import { GalleryModal } from "@/components/gallery";
import { Portal } from "@/components/portal";

import { disableScroll } from "@/shared/utils";

import { MasonryGrid } from "./masonry/grid";
import { isLastImage, reorder } from "./masonry/selectors";
import { Wrapper } from "./wrapper";
import { useBuilderContext } from "../../context";
import { BlockItem, BlockMasonry } from "../../types";

interface Props {
  item: BlockItem;
  position: [number, number];
}

export const SectionMasonry: FC<Props> = ({ item, position }) => {
  const { updateCell, preview } = useBuilderContext();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [rowIndex, colIndex] = position;

  useEffect(() => {
    disableScroll(selectedIndex > 0);
  }, [selectedIndex]);

  const onImageChange = (index: number) => {
    if (isLastImage(item.masonry || [], index)) {
      return setSelectedIndex(0);
    }
    if (index < 0) {
      return setSelectedIndex((item.masonry ?? []).length - 1);
    }
    setSelectedIndex(index);
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

  const onSelect = (idx: number) => {
    setSelectedIndex(idx);
  };

  const onRemove = (id: string) => {
    const newData = item.masonry?.filter((item) => item.id !== id);
    if (newData) update(newData);
  };

  if (item.type !== "masonry" || !item.masonry) return null;

  return (
    <Wrapper className={`row-${rowIndex}`}>
      <MasonryGrid
        items={reorder(item.masonry, 4) ?? []}
        onSelect={onSelect}
        onRemove={onRemove}
        preview={preview}
      />
      <div className="modal">
        <Portal id="modal-creatives">
          <GalleryModal
            items={item.masonry ?? []}
            onSelect={onImageChange}
            index={selectedIndex}
            onClose={() => setSelectedIndex(-1)}
          />
        </Portal>
      </div>
    </Wrapper>
  );
};
