import Image from "next/future/image";
import { FC, useState } from "react";

import { ContentToolbar } from "../../toolbar";
import MiniEditor from "../../toolbar/mini-editor";
import { Block } from "../../types";

interface Props {
  onChange: (change: Block) => void;
  updateImage: (image) => void;
  updateText: (image) => void;
  item?: Block["data"]["0"];
  columns: number;
  move: (str: "up" | "down") => void;
}
export const BlockItem: FC<Props> = ({
  item,
  updateImage,
  columns,
  move,
  updateText,
}) => {
  const [editorOpen, setEditorOpen] = useState(false);
  let className = "w-full md:w-1/2";
  if (columns === 1) {
    className = "w-full";
  }

  const isTextType = item?.type === "text";

  return (
    <div
      className={`relative border-dotted border-2 border-indigo-600  h-full justify-center items-center flex ${className}`}
    >
      <div className="absolute bottom-10 left-0 w-full text-center">
        <ContentToolbar
          updateImage={updateImage}
          move={move}
          setEditorOpen={setEditorOpen}
        />
      </div>
      <div className="absolute  left-0 w-full text-center">
        {editorOpen && (
          <MiniEditor
            onChange={(text) => updateText({ text })}
            text={isTextType ? item.data.text : ""}
          />
        )}
        {editorOpen && (
          <button onClick={() => setEditorOpen(false)}>Close</button>
        )}
      </div>
      <div className=" w-full h-full justify-center items-center flex">
        {item?.type === "image" && (
          <Image
            src={item.data.src}
            width="0"
            height="0"
            sizes="100vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt={item.data.description}
          />
        )}
        {!editorOpen && (
          <div
            className="text-3xl text-white description"
            dangerouslySetInnerHTML={{
              __html: item?.type === "text" ? item?.data.text : "",
            }}
          />
        )}
      </div>
      <style jsx global>{`
        .description h1 {
          font-size: 7rem !important;
        }
        .description h2 {
          font-size: 6rem !important;
        }
        .description h3 {
          font-size: 4rem !important;
        }
        .description h4 {
          font-size: 1.5rem !important;
        }
      `}</style>
    </div>
  );
};
