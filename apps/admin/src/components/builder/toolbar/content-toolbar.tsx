import classNames from "classnames";
import { FC, ReactNode } from "react";
import ReactStickyBox from "react-sticky-box";

import { ColorPicker } from "./color";
import { Reset } from "./helpers";
import { IconDelete, IconImage } from "./icons";
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
  const { removeCell, updateCell } = useBuilderContext();
  const isFirstRow = rowIndex === 0;
  if (isFirstRow) {
    return (
      <Wrapper>
        <div className="inline-flex  shadow-sm">
          <Button onClick={() => setFileExplorerOpen(true)}>
            <IconImage size={20} />
            <Reset
              visible={!!item?.image?.src}
              onClick={() =>
                updateCell(
                  { image: { src: "" }, type: "image" },
                  rowIndex,
                  colIndex,
                )
              }
            />
          </Button>
        </div>
      </Wrapper>
    );
  }
  if (item?.type === "image") {
    return (
      <Wrapper>
        <div className="inline-flex gap-2  shadow-sm">
          {!isFirstRow && (
            <>
              <Button onClick={() => setFileExplorerOpen(true)}>
                <IconImage size={20} />
                <Reset
                  visible={!!item?.image?.src}
                  onClick={() =>
                    updateCell(
                      { image: { src: "" }, type: "image" },
                      rowIndex,
                      colIndex,
                    )
                  }
                />
              </Button>
              <Button onClick={() => removeCell(rowIndex, colIndex)}>
                <IconDelete />
              </Button>
            </>
          )}
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="inline-flex items-center  justify-center gap-4">
        <ColorPicker onColorChange={onBgColorChange} color={item?.bgColor} />
        {!isFirstRow && (
          <Button onClick={() => removeCell(rowIndex, colIndex)}>
            <IconDelete />
          </Button>
        )}
        <style jsx global>{`
          .active {
            background: #21212b !important;
          }
        `}</style>
      </div>
    </Wrapper>
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
  return (
    <a
      href="#"
      className={classNames(
        "rounded-full bg-gray-50 p-1 shadow-lg hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-700",
        className,
        {
          active: active,
        },
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

const Wrapper = ({ children }) => (
  <div className="absolute top-0 right-0 z-10 m-4 h-full text-center">
    <ReactStickyBox className="mb-10" offsetTop={20}>
      {children}
    </ReactStickyBox>
  </div>
);
