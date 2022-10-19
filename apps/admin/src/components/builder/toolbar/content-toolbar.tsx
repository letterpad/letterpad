import { FC, ReactNode } from "react";

import { IconDelete, IconImage, IconRefresh, IconText } from "./icons";
import { useBuilderContext } from "../context";
import { BlockItem } from "../types";

interface Props {
  setEditorOpen: (visible: boolean) => void;
  editorOpen: boolean;
  setFileExplorerOpen: (visible: boolean) => void;
  rowIndex: number;
  colIndex: number;
  item?: BlockItem;
}
export const ContentToolbar: FC<Props> = ({
  setEditorOpen,
  editorOpen,
  setFileExplorerOpen,
  rowIndex,
  colIndex,
  item,
}) => {
  const { updateCell, removeCell, getColumns } = useBuilderContext();
  const noImgSrcInImgType = item?.type === "image" && !item?.image?.src;
  if (item?.type === "image") {
    return (
      <div className="absolute top-0 left-1/2 z-10 -ml-20 text-center">
        <div className="inline-flex rounded-md shadow-sm">
          <Button
            onClick={() => setFileExplorerOpen(true)}
            className="rounded-l-md "
          >
            <IconImage size={18} />
          </Button>
          {(rowIndex === 0 || getColumns(rowIndex).length === 1) && (
            <>
              <Button onClick={() => setEditorOpen(!editorOpen)}>
                <IconText />
              </Button>
            </>
          )}
          <Button
            onClick={() => removeCell(rowIndex, colIndex)}
            className="rounded-r-md "
          >
            <IconDelete />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-1/2 -ml-24 text-center">
      <div className="inline-flex rounded-md shadow-sm">
        {!noImgSrcInImgType && (
          <>
            <Button
              onClick={() => setEditorOpen(!editorOpen)}
              className="rounded-l-md "
              active={editorOpen}
            >
              <IconText />
            </Button>
            {/* @ts-ignore */}
            <Button onClick={() => updateCell({}, rowIndex, colIndex)}>
              <IconRefresh />
            </Button>
          </>
        )}
        <Button
          onClick={() => removeCell(rowIndex, colIndex)}
          className="rounded-r-md "
        >
          <IconDelete />
        </Button>
        <style jsx global>{`
          .active {
            background: #21212b !important;
          }
        `}</style>
      </div>
    </div>
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
