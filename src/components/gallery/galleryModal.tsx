//@ts-nocheck
import Image from "next/image";
import { FC } from "react";

import { Controls } from "./controls";
import { ThumbnailList } from "./thumbnails";
import { Item } from "./types";

interface Props {
  items: Item[];
  onSelect: (index: number) => void;
  index: number;
  onClose: () => void;
}
export const GalleryModal: FC<Props> = ({
  onSelect,
  index,
  items,
  onClose,
}) => {
  const item = items[index];
  if (index < 0) return null;
  const isPortrait = item.aspectRatio < 1;
  const maxH = window.innerHeight - 100;
  const width = isPortrait ? maxH * item.aspectRatio : 1400;
  const height = isPortrait ? maxH : 800;

  return (
    <div className="flex flex-row items-stretch bg-grey-lighter min-h-screen fixed top-0 dark:bg-black w-screen left-0 overflow-hidden">
      <div className="absolute top-0 right-0 z-50 m-6">
        <button onClick={onClose} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="w-32">
        <ThumbnailList items={items} onSelect={onSelect} index={index} />
      </div>
      <div className="w-full h-screen relative flex items-center justify-center">
        <Image
          alt="Mountains"
          src={item.src as string}
          width={width}
          height={height}
        />
        <Description description={item.description} />
        <Controls
          maxReached={true}
          minReached={true}
          onNext={() => onSelect(index + 1)}
          onPrevious={() => onSelect(index - 1)}
        />
      </div>
    </div>
  );
};

const Description = ({ description }) => {
  return (
    <div className="absolute bottom-0 left-0 p-2 bg-black w-full py-8 bg-opacity-80 text-white">
      {description}
    </div>
  );
};
