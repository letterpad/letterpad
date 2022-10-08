import Image from "next/future/image";
import { FC, useState } from "react";

import { ContentToolbar } from "../../toolbar";
import MiniEditor from "../../toolbar/mini-editor";
import { Block, BlockItem as BlockData } from "../../types";

interface Props {
  onChange: (change: Block) => void;
  updateBlock: (newData: BlockData, position?: number) => void;
  item?: Block["data"][0];
  columns: number;
  move: (str: "up" | "down") => void;
  preview: boolean;
  removeBlock: () => void;
}
export const BlockItem: FC<Props> = ({
  item,
  updateBlock,
  columns,
  move,
  preview,
  removeBlock,
}) => {
  const isEmptyBlock = item && Object.keys(item).length === 0;
  const [editorOpen, setEditorOpen] = useState(false);
  let className = "w-full";
  if (columns === 2) {
    className += " lg:w-1/2";
  } else if (columns === 3) {
    className += " md:1/3";
  }
  className += preview
    ? ""
    : " border-dotted border-2 border-gray-200 dark:border-gray-700 border-t-0 ";
  return (
    <div
      className={`relative h-full justify-center items-center flex ${className}`}
    >
      <div className="absolute bottom-10 left-0 w-full text-center">
        {!preview && (
          <ContentToolbar
            updateBlock={updateBlock}
            move={move}
            setEditorOpen={setEditorOpen}
            editorOpen={editorOpen}
            removeBlock={removeBlock}
          />
        )}
      </div>
      <div className="absolute  left-0 w-full text-center p-6">
        {editorOpen && (
          <MiniEditor
            onChange={(text) => updateBlock({ text: encodeURIComponent(text) })}
            text={decodeURIComponent(item?.text ?? "Write something...")}
          />
        )}
      </div>
      <div className=" w-full h-full justify-center items-center flex">
        {item?.image?.src && (
          <Image
            src={item.image.src}
            width="0"
            height="0"
            sizes="100vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt={item.image.description}
          />
        )}
        {!editorOpen && (
          <div
            className="text-3xl text-white absolute text-center p-6 w-full"
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(item?.text ?? ""),
            }}
          />
        )}
        {isEmptyBlock && !editorOpen && (
          <span className="opacity-60">Add a text or an image</span>
        )}
      </div>
    </div>
  );
};
