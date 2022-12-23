import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

import { Controls } from './controls';
import { ThumbnailList } from './thumbnails';

interface Props<T = any> {
  items: T[];
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
  const [size, setSize] = useState([1400, 800]);
  const [item, setItem] = useState(items[index]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const ar = items[index]?.aspectRatio || 1;
    const isPortrait = ar < 1;
    const maxH = window.innerHeight - 100;
    const width = isPortrait ? maxH * ar : 1400;
    const height = isPortrait ? maxH : 800;
    setItem(items[index]);
    setSize([width, height]);
  }, [index, items]);

  if (index < 0 || !item) return null;
  return (
    <div className="fixed top-0 left-0 z-[60] flex min-h-screen w-screen flex-row items-stretch overflow-hidden bg-white dark:bg-black">
      <div className="absolute top-0 right-0 z-[61] m-6">
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
      <div className="flex h-screen w-32 justify-center overflow-x-scroll shadow-md">
        <ThumbnailList items={items} onSelect={onSelect} index={index} />
      </div>
      <div className="relative flex h-screen w-full items-center justify-center">
        <Image
          alt="Mountains"
          src={item.src as string}
          width={size[0]}
          height={size[1]}
        />
        {/* <Description description={item.description} /> */}
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
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-80 p-2 py-8 text-white">
      {description}
    </div>
  );
};
