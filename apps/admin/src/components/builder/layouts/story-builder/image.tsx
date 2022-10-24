import classNames from "classnames";
import { FC, useEffect } from "react";
import { Parallax } from "react-parallax";
import StickyBox from "react-sticky-box";

import { getHeight, Wrapper } from "./wrapper";
import { useBuilderContext } from "../../context";
import { IconImage } from "../../toolbar/icons";
import MiniEditor from "../../toolbar/mini-editor";

interface Props {
  columns: number;
  item: any;
  position: [rowIndex: number, colIndex: number];
  formats: string;
  cover?: "small" | "big" | "banner";
  setEditorOpen: any;
}
export const SectionImage: FC<Props> = ({
  columns,
  item,
  position,
  formats,
  cover,
}) => {
  const { updateCell, preview } = useBuilderContext();
  const [rowIndex, colIndex] = position;

  const firstRow = rowIndex === 0;
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
      colIndex,
    );
  };

  return (
    <StickyBox
      data-background
      style={{
        minHeight: getHeight(cover),
      }}
      className={classNames(
        "flex w-full items-center  bg-cover bg-center bg-no-repeat ",
        `row-${rowIndex}`,
        {
          "bg-gray-200": true,
          "dark:bg-gray-800": true,
        },
      )}
    >
      <Parallax
        strength={300}
        lazy={true}
        bgImage={item?.image?.src}
        className="flex h-full w-full flex-col items-center justify-center"
        bgImageStyle={{ height: "100%", objectFit: "cover" }}
        contentClassName="w-full"
        style={{
          minHeight: getHeight(cover),
        }}
      >
        <Wrapper>
          {preview && <Text columns={columns} text={item.text} />}
          {!preview && firstRow ? (
            <MiniEditor
              onChange={update}
              formats={formats}
              text={decodeURIComponent(item?.text ?? "")}
            />
          ) : null}
        </Wrapper>
      </Parallax>
    </StickyBox>
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
