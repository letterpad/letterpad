import Image from "next/future/image";
import { FC, useState } from "react";

import FileExplorer from "@/components/file-explorer";
import { Button } from "@/components_v2/button";

import { ContentToolbar } from "../../toolbar";
import { IconImage } from "../../toolbar/icons";
import MiniEditor from "../../toolbar/mini-editor";
import { Block, BlockItem as BlockData } from "../../types";

import { Optional } from "@/types";

interface Props {
  onChange: (change: Block) => void;
  updateBlock: (newData: BlockData, position?: number) => void;
  item?: Block["data"][0];
  columns: number;
  preview: boolean;
  removeBlock: () => void;
  rowIndex: number;
}
export const Cell: FC<Props> = ({
  item,
  updateBlock,
  columns,
  preview,
  removeBlock,
  rowIndex,
}) => {
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const isEmptyBlock = item && Object.keys(item).length === 0;
  const [formats, setFormats] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  let className = "w-full";
  if (columns === 2) {
    className += " lg:w-1/2";
  } else if (columns === 3) {
    className += " md:1/3";
  }

  const isImage = item?.type === "image";
  if (isImage && !item.image?.src) {
    className += " bg-slate-100 dark:bg-slate-700 ";
  }

  return (
    <div
      className={`relative h-full justify-center items-center flex ${className}`}
    >
      <div className="absolute bottom-10 left-0 w-full text-center">
        {!preview && (
          <ContentToolbar
            updateBlock={updateBlock}
            setEditorOpen={(visible) => {
              setFormats("h1 h2 | alignleft aligncenter alignright ");
              setEditorOpen(visible);
            }}
            editorOpen={editorOpen}
            removeBlock={removeBlock}
            showOnlyImage={isImage && !item?.image?.src}
            showOnlyRemove={isImage}
            setFileExplorerOpen={setFileExplorerOpen}
            rowIndex={rowIndex}
          />
        )}
      </div>
      {!item?.image?.src && isImage && !preview && (
        <div className="absolute top-1/2 left-1/2 -ml-8 -mt-10">
          <Button
            onClick={() => setFileExplorerOpen(true)}
            type="primary"
            className="p-2 rounded-full"
          >
            <IconImage size={40} />
          </Button>
        </div>
      )}
      {editorOpen && (
        <div className="absolute left-0 w-full text-center p-6 md:px-20 ">
          <MiniEditor
            onChange={(text) =>
              updateBlock({
                text: encodeURIComponent(text),
                type: item?.type ?? "text",
              })
            }
            formats={formats}
            text={decodeURIComponent(item?.text ?? "Write something...")}
          />
        </div>
      )}
      <div className="w-full h-full justify-center items-center flex">
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
        {!editorOpen && item?.text && (
          <div
            className={
              "text-white absolute text-center p-6" +
              (item.type === "image"
                ? "shadow-lg bg-opacity-10 p-20  rounded-md bg-black/40"
                : "p-10")
            }
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(item.text),
            }}
          />
        )}
        {isEmptyBlock && !editorOpen && (
          <span className="opacity-60">Add a text or an image</span>
        )}
      </div>
      <FileExplorer
        multi={true}
        isVisible={!!fileExplorerOpen}
        handleCancel={() => setFileExplorerOpen(false)}
        onInsert={(image) => {
          setFileExplorerOpen(false);
          const { src, width, height, caption } = image[0];
          updateBlock({
            image: { src, width, height, description: caption },
            type: "image",
          });
        }}
      />
    </div>
  );
};
