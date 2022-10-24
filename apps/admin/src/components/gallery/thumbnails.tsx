import Image from "next/image";
import { useEffect, useRef } from "react";

interface Props<T> {
  items: T[];
  onSelect: (index: number) => void;
  index: number;
}

export const ThumbnailList = <
  T extends { src: string; description?: string; caption?: string },
>({
  items,
  onSelect,
  index,
}: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (ref.current?.childNodes[index] as HTMLDivElement)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [index]);

  return (
    <div className="flex h-screen flex-col overflow-scroll" ref={ref}>
      {items.map((item, i) => (
        <div key={i}>
          <Image
            src={item.src as string}
            width={100}
            height={100}
            className={
              "bg-black p-2  " +
              (index === i
                ? "opacity-1 border-2 border-solid border-blue-500 "
                : "opacity-50 hover:opacity-100 ")
            }
            onClick={() => onSelect(i)}
            objectFit="fill"
            alt={item.description || item.caption}
          />
        </div>
      ))}
    </div>
  );
};
