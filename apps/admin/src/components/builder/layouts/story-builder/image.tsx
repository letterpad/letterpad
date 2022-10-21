import classNames from "classnames";
import { FC, ReactNode, useEffect } from "react";
import StickyBox from "react-sticky-box";

import { getHeight, hasText, Wrapper } from "./wrapper";
import { useBuilderContext } from "../../context";
import { IconImage } from "../../toolbar/icons";
import MiniEditor from "../../toolbar/mini-editor";

interface Props {
  columns: number;
  item: any;
  editable: boolean;
  position: [rowIndex: number, colIndex: number];
  formats: string;
  cover?: "small" | "big" | "banner";
  setEditorOpen: any;
  setFileExplorerOpen: (open: boolean) => void;
}
export const SectionImage: FC<Props> = ({
  columns,
  item,
  editable,
  position,
  formats,
  cover,
  setEditorOpen,
  setFileExplorerOpen,
}) => {
  const { updateCell } = useBuilderContext();
  const [rowIndex, colIndex] = position;

  useEffect(() => {
    const div = document.querySelector(`.row-${rowIndex}`) as HTMLDivElement;
    div?.style.setProperty("min-height", getHeight(cover) + "px");
  }, [cover, rowIndex]);

  return (
    <StickyBox
      data-background
      style={{
        backgroundImage: `url(${item?.image?.src})`,
        minHeight: getHeight(cover),
      }}
      className={classNames(
        "flex w-full items-center  bg-cover bg-center bg-no-repeat ",
        `row-${rowIndex}`,
        {
          "bg-gray-900": true,
        },
      )}
    >
      {!item?.image?.src && (
        <div className="absolute flex w-full justify-center">
          <span
            className="cursor-pointer"
            onClick={() => setFileExplorerOpen(true)}
          >
            <IconImage size={100} color="#333" />
          </span>
        </div>
      )}
      {editable ? (
        <Wrapper>
          <MiniEditor
            onChange={(text) =>
              updateCell(
                {
                  text: encodeURIComponent(text),
                  type: item?.type ?? "text",
                },
                rowIndex,
                colIndex,
              )
            }
            formats={formats}
            text={decodeURIComponent(
              item?.text && hasText(item?.text) ? item.text : "",
            )}
          />
        </Wrapper>
      ) : (
        <Wrapper>
          <div
            data-text
            className={
              columns == 2
                ? "margin-auto max-w-full lg:max-w-[calc(500px)]"
                : ""
            }
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(item?.text ?? ""),
            }}
            onClick={() => setEditorOpen(true)}
          />
        </Wrapper>
      )}
    </StickyBox>
  );
};
