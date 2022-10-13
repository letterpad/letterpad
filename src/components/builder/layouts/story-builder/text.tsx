import { FC, ReactNode } from "react";

import { useBuilderContext } from "../../context";
import MiniEditor from "../../toolbar/mini-editor";
import { BlockItem } from "../../types";

interface Props {
  columns: number;
  item: BlockItem;
  editable: boolean;
  position: [number, number];
  formats: string;
}

export const SectionText: FC<Props> = ({
  columns,
  item,
  editable,
  position,
  formats,
}) => {
  const { updateCell } = useBuilderContext();
  const [rowIndex, colIndex] = position;
  if (item.type === "image") return null;

  if (editable) {
    return (
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
          text={decodeURIComponent(item?.text ?? "Write something...")}
        />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div
        data-text
        className={
          columns == 2 ? "max-w-full lg:max-w-[calc(500px)] margin-auto" : ""
        }
        dangerouslySetInnerHTML={{
          __html: decodeURIComponent(item.text ?? ""),
        }}
      />
    </Wrapper>
  );
};

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center leading-6 text-gray-800 dark:text-white lg:py-20 lg:px-40 margin-auto">
      {children}
    </div>
  );
};
