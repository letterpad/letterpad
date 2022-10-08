import { FC, ReactNode } from "react";

import { IconDelete, IconImage, IconRefresh, IconText } from "./icons";
import { BlockItem } from "../types";

interface Props {
  updateBlock: (newData: BlockItem, position?: number) => void;
  removeBlock: () => void;
  setEditorOpen: (visible: boolean) => void;
  editorOpen: boolean;
  showOnlyImage: boolean;
  setFileExplorerOpen: (visible: boolean) => void;
  showOnlyRemove: boolean;
  rowIndex: number;
}
export const ContentToolbar: FC<Props> = ({
  updateBlock,
  setEditorOpen,
  editorOpen,
  removeBlock,
  showOnlyImage,
  setFileExplorerOpen,
  showOnlyRemove,
  rowIndex,
}) => {
  if (showOnlyRemove) {
    return (
      <div className="inline-flex rounded-md shadow-sm">
        <Button
          onClick={() => setFileExplorerOpen(true)}
          className="rounded-l-md "
        >
          <IconImage size={18} />
        </Button>
        {rowIndex === 0 && (
          <>
            <Button onClick={() => setEditorOpen(!editorOpen)}>
              <IconText />
            </Button>
            <Button onClick={() => updateBlock({})}>Cover</Button>
          </>
        )}
        <Button onClick={() => removeBlock()} className="rounded-r-md ">
          <IconDelete />
        </Button>
      </div>
    );
  }
  if (showOnlyImage) {
    return (
      <div className="inline-flex rounded-md shadow-sm">
        <Button onClick={() => setFileExplorerOpen(true)}>
          <IconImage size={18} />
        </Button>
      </div>
    );
  }
  return (
    <>
      <div className="inline-flex rounded-md shadow-sm">
        {!showOnlyImage && (
          <>
            <Button
              onClick={() => setEditorOpen(!editorOpen)}
              className="rounded-l-md "
              active={editorOpen}
            >
              <IconText />
            </Button>
            <Button onClick={() => updateBlock({})}>
              <IconRefresh />
            </Button>
          </>
        )}
        <Button onClick={() => removeBlock()} className="rounded-r-md ">
          <IconDelete />
        </Button>
        <style jsx global>{`
          .active {
            background: #21212b !important;
          }
        `}</style>
      </div>
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
