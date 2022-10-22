import classNames from "classnames";
import { FC, ReactNode, useEffect } from "react";

import { getHeight, Wrapper } from "./wrapper";
import { useBuilderContext } from "../../context";
import MiniEditor from "../../toolbar/mini-editor";
import { BlockItem } from "../../types";

interface Props {
  columns: number;
  item: BlockItem;
  editable: boolean;
  position: [number, number];
  formats: string;
  setEditorOpen: any;
  cover?: "small" | "big" | "banner";
}

export const SectionText: FC<Props> = ({
  columns,
  item,
  editable,
  position,
  formats,
  setEditorOpen,
  cover,
}) => {
  const { updateCell } = useBuilderContext();
  const [rowIndex, colIndex] = position;

  useEffect(() => {
    const div = document.querySelector(`.row-${rowIndex}`) as HTMLDivElement;
    div?.style.setProperty("min-height", getHeight(cover) + "px");
  }, [cover, rowIndex]);

  if (item.type === "image") return null;

  if (editable) {
    return (
      <Wrapper className={`row-${rowIndex}`}>
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
          text={decodeURIComponent(item?.text ?? "")}
        />
      </Wrapper>
    );
  }
  return (
    <Wrapper className={`row-${rowIndex}`}>
      <div
        data-text
        className={
          columns == 2 ? "margin-auto max-w-full lg:max-w-[calc(500px)]" : ""
        }
        onClick={() => setEditorOpen(true)}
        dangerouslySetInnerHTML={{
          __html: decodeURIComponent(item.text ?? ""),
        }}
      />
    </Wrapper>
  );
};
