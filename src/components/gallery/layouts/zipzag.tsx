import Image from "next/image";

import { ItemPlaceholder } from "@/components/post/components/templates/portfolio/itemPlaceholder";

import { RemoveButton } from "../remove";
import { Item } from "../types";

export const getZigZagLayout = (
  items: Item[],
  onSelect,
  removeItem,
  onSave,
) => {
  return items.map((item, i) => {
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
    const width = window.innerWidth / 2;
    const height = window.innerHeight;

    return (
      <div
        key={item.src}
        className={`flex flex-col ${direction}  md:space-y-0 md:space-x-12 items-center`}
      >
        <div
          className={`group relative w-full cursor-pointer md:w-1/2 ${
            isPortrait ? "md:px-0" : ""
          }`}
        >
          <Image
            src={item.src as string}
            width={width}
            height={height}
            alt="img"
            // layout="responsive"
            objectFit="cover"
            onClick={() => onSelect(i)}
          />
          <RemoveButton onClick={() => removeItem(i)} />
        </div>
        <div className="flex-1">
          {item.description}
          <br />
          <br />
        </div>
      </div>
    );
  });
};
