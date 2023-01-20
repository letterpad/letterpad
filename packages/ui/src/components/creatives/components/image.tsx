import classNames from "classnames";
import { FC, lazy, useEffect, useState } from "react";
import StickyBox from "react-sticky-box";

import { Text } from "./text";
import { getHeight, Wrapper } from "./wrapper";
import { useBuilderContext } from "../context/context";
import { BlockItem } from "../types";
import { Parallax } from "../../parallax";

const LazyMiniEditor = lazy(() =>
  import("../toolbar/mini-editor").then((m) => ({ default: m.MiniEditor }))
);

interface Props {
  columns: number;
  item?: BlockItem;
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
  const [height, setHeight] = useState<number | string>(600);

  const firstRow = rowIndex === 0;
  useEffect(() => {
    const height = getHeight(cover);
    setHeight(height);
    const div = document.querySelector(`.row-${rowIndex}`) as HTMLDivElement;
    div?.style.setProperty("min-height", height + "px");
  }, [colIndex, cover, item?.type, rowIndex]);

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

  const hasbgImage =
    item?.image?.pattern?.gradientStart && item?.image?.pattern?.gradientEnd;
  const backgroundImage = `radial-gradient(${item?.image?.pattern?.gradientStart}, ${item?.image?.pattern?.gradientEnd})`;

  return (
    <StickyBox
      data-background
      // style={{
      //   minHeight: getHeight(cover),
      // }}
      className={classNames(
        "flex w-full items-center  bg-cover bg-center bg-no-repeat ",
        `row-${rowIndex}`,
        {
          "bg-gray-200": true,
          "dark:bg-gray-800": true,
        }
      )}
    >
      <Parallax
        strength={100}
        lazy={true}
        bgImage={item?.image?.src}
        className="flex h-full w-full flex-col items-center justify-center"
        bgImageStyle={{ height: "100%", objectFit: "cover" }}
        contentClassName="w-full z-10"
        style={{
          minHeight: height,
        }}
      >
        <Wrapper className="w-full">
          {preview && <Text columns={columns} text={item?.text!} />}
          {!preview && firstRow ? (
            <LazyMiniEditor
              onChange={update}
              formats={formats}
              text={decodeURIComponent(item?.text ?? "")}
            />
          ) : null}
        </Wrapper>
      </Parallax>
      {firstRow && (
        <div
          className={"dots"}
          style={{
            backgroundSize: "3px 3px",
            backgroundColor: item?.image?.pattern?.background ?? "",
            backgroundImage: hasbgImage ? backgroundImage : "",
          }}
        ></div>
      )}
    </StickyBox>
  );
};
