import { FC, useCallback, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";

import { Controls } from "./controls";
import { ThumbnailList } from "./thumbnails";
import { BlockMasonry } from "../creatives/types";
import { useEscapeKey } from "../drawer/useEscapeKey";

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
  const [size, setSize] = useState({ width: 0, height: 0 });
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    }
  },[]);

  const fixSize = useCallback(() => {
    const ar = item?.aspectRatio || 1;
    const isPortrait = ar < 1;
    const maxH = window.innerHeight - 200;
    const width = isPortrait ? maxH * ar : Math.min(window.innerWidth, maxH * ar);;
    const height = isPortrait ? maxH : width/ar;
    setSize({width, height});
  },[item?.aspectRatio])

  useEffect(()=>{
      fixSize();
      document.addEventListener('resize', fixSize);
      return () => {
        document.removeEventListener('resize', fixSize);
      }
  },[fixSize])

  useEscapeKey(onClose);


  if (index < 0) return null;
  
  return (
    <>
      <div className="bg-white fixed top-0 left-0 flex min-h-screen w-screen flex-row items-stretch overflow-hidden dark:bg-black z-10">
        <div className="relative w-full flex h-screen items-center justify-center flex-col">
          <div className="absolute top-0 right-0 z-50 m-6">
            <button onClick={onClose} className="backdrop-brightness-50">
              <CgClose className="text-white"/>
            </button>
          </div>
          <img
            alt={item.caption}
            src={item.src as string}
            style={{...size, objectFit: "contain"}}
            loading="lazy"
          />
          <Description description={item.description} />
          <div className="w-full" ref={thumbnailsRef}>
            <ThumbnailList items={items} onSelect={onSelect} index={index} />
          </div>
        </div>
        <div className="absolute w-full flex justify-between z-40 top-[50%] px-8">
          <Controls
            maxReached={true}
            minReached={true}
            onNext={() => onSelect(index + 1)}
            onPrevious={() => onSelect(index - 1)}
          />
        </div>
      </div>
    </>
  );
};

const Description: FC<{ description?: string }> = ({ description }) => {
  return (
    <div className="absolute px-4 top-0 left-0 w-full bg-black bg-opacity-80 p-2 py-8 text-white">
      {description} 
    </div>
  );
};
