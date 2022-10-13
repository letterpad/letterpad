import classNames from "classnames";
import { FC, ReactNode } from "react";
import StickyBox from "react-sticky-box";

import { useBuilderContext } from "../../context";
import MiniEditor from "../../toolbar/mini-editor";

export const SectionImage = ({
  columns,
  item,
  editable,
  position,
  formats,
  cover,
}) => {
  const { updateCell } = useBuilderContext();
  const [rowIndex, colIndex] = position;
  if (item?.type === "text" || !item?.image?.src)
    return (
      <div
        className="bg-gray-400"
        style={{
          height: getHeight(cover, rowIndex),
        }}
      />
    );
  return (
    <StickyBox
      data-background
      style={{
        backgroundImage: `url(${item?.image?.src})`,
        height: getHeight(cover, rowIndex),
      }}
      className={classNames(
        "flex w-full items-center justify-center bg-cover bg-center bg-no-repeat bg-slate-700",
        {
          // "lg:w-1/2": columns === 2,
          "h-screen": item.cover === "big",
          "h-[calc(40vh)]": cover === "small",
        },
      )}
    >
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
                ? "max-w-full lg:max-w-[calc(500px)] margin-auto"
                : ""
            }
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(item?.text ?? ""),
            }}
          />
        </Wrapper>
      )}
    </StickyBox>
  );
};

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center p-6 text-center leading-6 text-gray-800 dark:text-white lg:py-20 lg:px-40 margin-auto">
      {children}
    </div>
  );
};

const hasText = (text: string) => {
  const decodedText = decodeURIComponent(text);
  return decodedText !== "<html><body></body></html>";
};

const getHeight = (size: "small" | "big", rowIndex: number) => {
  const h = typeof window !== "undefined" ? window.innerHeight : 600;
  if (rowIndex > 0) return h;
  if (size === "small") return h * 0.4;
  if (size === "big") return h;
  return 600;
};
