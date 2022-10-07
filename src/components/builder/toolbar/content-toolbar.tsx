import { FC, ReactNode, useState } from "react";

import FileExplorer from "@/components/file-explorer";

import { IconImage, IconLeft, IconRefresh, IconRight, IconText } from "./icons";
import { BlockItem } from "../types";

interface Props {
  updateBlock: (newData: BlockItem, position?: number) => void;
  setEditorOpen: (visible: boolean) => void;
  move: (dir: "up" | "down") => void;
  editorOpen: boolean;
}
export const ContentToolbar: FC<Props> = ({
  updateBlock,
  move,
  setEditorOpen,
  editorOpen,
}) => {
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);

  return (
    <>
      <div className="inline-flex rounded-md shadow-sm">
        <Button
          onClick={() => setFileExplorerOpen(true)}
          className="rounded-l-lg"
        >
          <IconImage />
        </Button>
        <Button onClick={() => setEditorOpen(!editorOpen)} active={editorOpen}>
          <IconText />
        </Button>
        <Button onClick={() => move("up")}>
          <IconLeft />
        </Button>
        <Button onClick={() => move("down")}>
          <IconRight />
        </Button>
        <Button onClick={() => updateBlock({})} className="rounded-r-lg ">
          <IconRefresh />
        </Button>
        <style jsx global>{`
          .active {
            background: #21212b !important;
          }
        `}</style>
      </div>
      <FileExplorer
        multi={true}
        isVisible={!!fileExplorerOpen}
        handleCancel={() => setFileExplorerOpen(false)}
        onInsert={(image) => {
          setFileExplorerOpen(false);
          const { src, width, height, caption } = image[0];
          updateBlock({ image: { src, width, height, description: caption } });
        }}
      />
    </>
  );
};

interface ButtonProps {
  onClick: () => void;
  className?: string;
  children: ReactNode;
  active?: boolean;
}
const Button: FC<ButtonProps> = ({
  onClick,
  children,
  className = "",
  active,
}) => {
  className += active ? " active" : "";
  return (
    <a
      href="#"
      className={className + " icon-class "}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};
