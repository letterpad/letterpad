import { useState } from "react";

import { GalleryModal, PortfolioLayout } from "@/components/gallery";
import { Item } from "@/components/gallery/types";

const pageData = {
  rows: Array.from({ length: 23 }, (_, i) => {
    const isPortrait = random(0, 1) === 1;
    const width = isPortrait ? 800 : 1400;
    const height = isPortrait ? 1400 : 800;
    return {
      src: `https://picsum.photos/${width}/${height}/?random=` + i,
      aspectRatio: isPortrait ? 9 / 16 : 16 / 9,
      description: `In publishing and graphic design, Lorem ipsum is a placeholder
                  text commonly used to demonstrate the visual form of a document
                  or a typeface without relying on meaningful content.`,
      alt: "",
      title: "",
      index: i,
      __typename: "GridItem" as any,
    };
  }),
};

export const Portfolio = ({ layout, onSave }) => {
  // const pageData = JSON.parse(text);
  const empty = pageData.rows.length === 0;

  const [items, setItems] = useState<Item[]>(empty ? [] : pageData?.rows);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onImageChange = (index: number) => {
    if (index > items.length - 1) {
      return setSelectedIndex(0);
    }
    if (index < 0) {
      return setSelectedIndex(items.length - 1);
    }
    setSelectedIndex(index);
  };
  return (
    <PortfolioLayout
      onSave={(i, data) => {
        const updatedItems = items.map((item, idx) => {
          if (idx === i) {
            return {
              ...item,
              ...data,
              __typename: "GridItem",
            };
          }
          return item;
        });
        onSave(JSON.stringify({ rows: updatedItems }));
      }}
      layout={layout}
      items={items}
      addItem={() => {
        const newItems = [
          { description: "Sample description", __typename: "GridPlaceholder" },
          ...items,
        ] as Item[];
        setItems(newItems);
      }}
      removeItem={(index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        onSave(JSON.stringify({ rows: newItems }));
      }}
      modal={
        <GalleryModal
          items={items}
          onSelect={onImageChange}
          index={selectedIndex}
          onClose={() => setSelectedIndex(-1)}
        />
      }
      onSelect={onImageChange}
    />
  );
};

function random(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
