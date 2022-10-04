import { FC, useState } from "react";

import FileExplorer from "@/components/file-explorer";

import { IconImage, IconLeft, IconRight, IconText } from "./icons";

interface Props {
  updateImage: (image: {
    src: string;
    width?: number;
    height?: number;
  }) => void;
  setEditorOpen: (visible: boolean) => void;
  move: (dir: "up" | "down") => void;
}
export const ContentToolbar: FC<Props> = ({
  updateImage,
  move,
  setEditorOpen,
}) => {
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);

  return (
    <>
      <div className="inline-flex rounded-md shadow-sm">
        <a
          href="#"
          aria-current="page"
          className="rounded-l-lg icon-class"
          onClick={(e) => {
            e.preventDefault();
            setFileExplorerOpen(true);
          }}
        >
          <IconImage />
        </a>
        <a
          href="#"
          className="icon-class"
          onClick={(e) => {
            e.preventDefault();
            setEditorOpen(true);
          }}
        >
          <IconText />
        </a>
        <a
          href="#"
          className="icon-class"
          onClick={(e) => {
            e.preventDefault();
            move("up");
          }}
        >
          <IconLeft />
        </a>
        <a
          href="#"
          className="icon-class rounded-r-md"
          onClick={(e) => {
            e.preventDefault();
            move("down");
          }}
        >
          <IconRight />
        </a>
      </div>
      <FileExplorer
        multi={true}
        isVisible={!!fileExplorerOpen}
        handleCancel={() => setFileExplorerOpen(false)}
        onInsert={(image) => {
          setFileExplorerOpen(false);
          const { src, width, height, caption } = image[0];
          updateImage({ src, width, height });
        }}
      />
    </>
  );
};
