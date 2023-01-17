import { FC } from "react";

import { Controls } from "./controls";
import { ThumbnailList } from "./thumbnails";
import { BlockMasonry } from "../creatives/types";

interface Props {
  items: BlockMasonry[];
  onSelect: (_index: number) => void;
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
  const ar = item.aspectRatio || 1;
  const isPortrait = ar < 1;
  const maxH = window.innerHeight - 100;
  const width = isPortrait ? maxH * ar : 1400;
  const height = isPortrait ? maxH : 800;

  return (
    <div className="bg-grey-lighter fixed top-0 left-0 flex min-h-screen w-screen flex-row items-stretch overflow-hidden dark:bg-black">
      <div className="absolute top-0 right-0 z-50 m-6">
        <button onClick={onClose} className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
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
      <div className="relative flex h-screen w-full items-center justify-center">
        <img
          alt={item.caption}
          src={item.src as string}
          width={width}
          height={height}
          loading="lazy"
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

const Description: FC<{ description?: string }> = ({ description }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-80 p-2 py-8 text-white">
      {description}
    </div>
  );
};
