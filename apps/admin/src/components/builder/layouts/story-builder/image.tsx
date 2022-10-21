import classNames from "classnames";
import { FC, ReactNode, useEffect } from "react";
import StickyBox from "react-sticky-box";

import { useBuilderContext } from "../../context";
import MiniEditor from "../../toolbar/mini-editor";

interface Props {
  columns: number;
  item: any;
  editable: boolean;
  position: [rowIndex: number, colIndex: number];
  formats: string;
  cover: "small" | "big" | "banner";
}
export const SectionImage: FC<Props> = ({
  columns,
  item,
  editable,
  position,
  formats,
  cover,
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
        "flex w-full items-center justify-center bg-cover bg-center bg-no-repeat ",
        `row-${rowIndex}`,
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
                ? "margin-auto max-w-full lg:max-w-[calc(500px)]"
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
    <div className="margin-auto flex h-full w-full flex-col items-center justify-center p-6 text-center leading-6 text-gray-800 dark:text-white lg:py-20 lg:px-40">
      {children}
    </div>
  );
};

const hasText = (text: string) => {
  const decodedText = decodeURIComponent(text);
  return decodedText !== "<html><body></body></html>";
};

const getHeight = (size: "small" | "big" | "banner") => {
  const h = typeof window !== "undefined" ? window.innerHeight : 600;
  if (size === "small") return h * 0.4;
  if (size === "big") return h;
  if (size === "banner") return 200;
  return h;
};
