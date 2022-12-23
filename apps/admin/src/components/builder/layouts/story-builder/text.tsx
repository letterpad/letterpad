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
  position,
  formats,
  cover,
}) => {
  const { updateCell, preview } = useBuilderContext();
  const [rowIndex, colIndex] = position;

  useEffect(() => {
    const div = document.querySelector(`.row-${rowIndex}`) as HTMLDivElement;
    div?.style.setProperty("min-height", getHeight(cover) + "px");
  }, [cover, rowIndex]);

  const update = (text: string) => {
    updateCell(
      {
        text: encodeURIComponent(text),
        type: item?.type ?? "text",
      },
      rowIndex,
      colIndex
    );
  };
  if (item.type === "image") return null;

  return (
    <Wrapper className={`row-${rowIndex}`}>
      {preview ? (
        <Text columns={columns} text={item.text} />
      ) : (
        <MiniEditor
          onChange={update}
          formats={formats}
          text={decodeURIComponent(item?.text ?? "")}
        />
      )}
    </Wrapper>
  );
};

const Text = ({ columns, text = "" }) => (
  <div
    data-text
    className={
      columns == 2 ? "margin-auto max-w-full lg:max-w-[calc(500px)]" : "w-full"
    }
    dangerouslySetInnerHTML={{
      __html: decodeURIComponent(text),
    }}
  />
);
