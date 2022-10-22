import classNames from "classnames";
import { FC, ReactNode, useRef } from "react";

import { ColorPicker } from "./color";
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
  onBgColorChange: (color: string) => void;
}
export const ContentToolbar: FC<Props> = ({
  setFileExplorerOpen,
  rowIndex,
  colIndex,
  item,
  onBgColorChange,
}) => {
  const { removeCell } = useBuilderContext();
  const isFirstRow = rowIndex === 0;
  const colorPickerRef = useRef<HTMLInputElement>(null);
  if (isFirstRow) {
    return (
      <div className="absolute top-0 right-0 z-10 m-4 text-center">
        <div className="inline-flex rounded-md shadow-sm">
          <Button
            onClick={() => setFileExplorerOpen(true)}
            className="rounded-md"
          >
            <IconImage size={18} />
          </Button>
        </div>
      </div>
    );
  }
  if (item?.type === "image") {
    return (
      <div className="absolute top-0 right-0 z-10 m-4  text-center">
        <div className="inline-flex gap-2 rounded-md shadow-sm">
          {!isFirstRow && (
            <>
              <Button
                onClick={() => setFileExplorerOpen(true)}
                className="rounded-l-md "
              >
                <IconImage size={20} />
              </Button>
              <Button
                onClick={() => removeCell(rowIndex, colIndex)}
                className="rounded-r-md "
              >
                <IconDelete />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames("absolute top-0 right-0  m-4 text-center", {
        "-ml-16": isFirstRow,
        "-ml-24": !isFirstRow,
      })}
    >
      <div className="inline-flex gap-4 rounded-md shadow-sm">
        <ColorPicker onColorChange={onBgColorChange} color={item?.bgColor} />
        {!isFirstRow && (
          <Button
            onClick={() => removeCell(rowIndex, colIndex)}
            className="rounded-md "
          >
            <IconDelete />
          </Button>
        )}
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
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};
