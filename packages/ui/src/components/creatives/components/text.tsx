import { FC, lazy, useEffect } from "react";

import { getHeight, Wrapper } from "./wrapper";
import { useBuilderContext } from "../context/context";
import { BlockItem } from "../types";

const LazyMiniEditor = lazy(() =>
  import("../toolbar/mini-editor").then((m) => ({ default: m.MiniEditor }))
);

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
  if (item.type !== "text") return null;

  return (
    <Wrapper>
      {preview ? (
        <Text columns={columns} text={item.text ?? ""} />
      ) : (
        <LazyMiniEditor
          onChange={update}
          formats={formats}
          text={decodeURIComponent(item?.text ?? "")}
        />
      )}
    </Wrapper>
  );
};

export const Text: FC<{ columns: number; text: string }> = ({
  columns,
  text = "",
}) => (
  <div
    data-text
    className={
      columns == 2
        ? "margin-auto w-full max-w-full lg:max-w-[calc(500px)]"
        : "w-full"
    }
    dangerouslySetInnerHTML={{
      __html: decodeURIComponent(text),
    }}
  />
);
