import { useEffect, useRef } from "react";

interface Props<T> {
  items: T[];
  onSelect: (index: number) => void;
  index: number;
}

export const ThumbnailList = <
  T extends { src: string; description?: string; caption?: string }
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
    <div className="flex w-screen items-center justify-center flex-row overflow-x-scroll absolute bottom-0" ref={ref}>
      {items.map((item, i) => (
        <div key={i}>
          <img
            src={item.src as string}
            width={100}
            height={100}
            className={
              "p-2  " +
              (index === i
                ? "opacity-1 border-2 border-solid border-blue-500 "
                : "opacity-80 hover:opacity-100 ")
            }
            onClick={() => onSelect(i)}
            loading="lazy"
            style={{ objectFit: "fill" }}
            alt={item.description || item.caption}
          />
        </div>
      ))}
    </div>
  );
};
