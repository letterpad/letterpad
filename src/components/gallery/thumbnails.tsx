import Image from "next/image";
import { FC, useEffect, useRef } from "react";

import { Item } from "./types";

interface Props {
  items: Item[];
  onSelect: (index: number) => void;
  index: number;
}

export const ThumbnailList: FC<Props> = ({ items, onSelect, index }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    ref.current?.childNodes[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [index]);

  return (
    <div className="flex flex-col overflow-scroll h-screen" ref={ref}>
      {items.map((item, i) => (
        <div key={i}>
          <Image
            //@ts-ignore
            src={item.src as string}
            width={100}
            height={100}
            className={
              "bg-black p-2  " +
              (index === i
                ? "opacity-1 border-2 border-blue-500 border-solid "
                : "opacity-50 hover:opacity-100 ")
            }
            onClick={() => onSelect(i)}
            objectFit="fill"
            alt={item.description}
          />
        </div>
      ))}
    </div>
  );
};
