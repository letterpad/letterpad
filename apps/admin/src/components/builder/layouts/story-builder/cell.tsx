import classNames from "classnames";
import { FC, useState } from "react";
import StickyBox from "react-sticky-box";

import FileExplorer from "@/components/file-explorer";

import { createId } from "@/shared/utils";

import { SectionImage } from "./image";
import { SectionMasonry } from "./masonry";
import { SectionText } from "./text";
import { useBuilderContext } from "../../context";
import { ContentToolbar } from "../../toolbar";
import { Block } from "../../types";
import { random } from "../../utils";

interface Props {
  row?: Block;
  columns: number;
  rowIndex: number;
  colIndex: number;
}
export const Cell: FC<Props> = ({ row, columns, rowIndex, colIndex }) => {
  const { preview, updateCell } = useBuilderContext();
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [formats, setFormats] = useState(
    "h1 h2 | fontfamily fontsize alignleft aligncenter alignright | blockquote | forecolor",
  );
  const item = row?.data[colIndex];
  const isText = item?.type === "text";
  const isImage = item?.type === "image";
  const isMasonry = item?.type === "masonry";
  const isFirstRow = rowIndex === 0;

  const [editorOpen, setEditorOpen] = useState(isText || columns === 1);
  return (
    <div
      className={classNames(
        "relative flex w-full justify-center align-middle",
        "row-" + rowIndex,
      )}
      style={{ backgroundColor: item?.bgColor }}
      onClick={() => setEditorOpen(isText || columns === 1)}
    >
      {!preview && (
        <ContentToolbar
          setEditorOpen={(visible) => {
            setFormats(
              "h1 h2 | fontsize fontfamily alignleft aligncenter alignright | blockquote | forecolor",
            );
            setEditorOpen(visible);
          }}
          editorOpen={editorOpen}
          item={item}
          setFileExplorerOpen={setFileExplorerOpen}
          rowIndex={rowIndex}
          colIndex={colIndex}
          onBgColorChange={(color) =>
            updateCell(
              {
                bgColor: color,
                type: "text",
              },
              rowIndex,
              colIndex,
            )
          }
        />
      )}
      <div className="w-full">
        {isText && !isFirstRow && (
          <SectionText
            columns={columns}
            item={item}
            editable={!isFirstRow}
            setEditorOpen={() => {
              setFormats(
                "h1 h2 | fontsize fontfamily alignleft aligncenter alignright | blockquote | forecolor",
              );
              setEditorOpen(true);
            }}
            position={[rowIndex, colIndex]}
            cover={row?.cover}
            formats={formats}
          />
        )}
        {(isImage || isFirstRow) && (
          <SectionImage
            item={item}
            columns={columns}
            position={[rowIndex, colIndex]}
            formats={formats}
            cover={row?.cover}
            setEditorOpen={() => {
              setFormats(
                "h1 h2 | fontsize_formats fontfamily alignleft aligncenter alignright | blockquote | forecolor",
              );
              setEditorOpen(true);
            }}
          />
        )}
        {isMasonry && (
          <SectionMasonry item={item} position={[rowIndex, colIndex]} />
        )}
      </div>
      <FileExplorer
        multi={true}
        isVisible={!!fileExplorerOpen}
        handleCancel={() => setFileExplorerOpen(false)}
        onInsert={(images) => {
          setFileExplorerOpen(false);
          const { src, width = 1200, height = 800, caption } = images[0];
          if (isImage || isFirstRow) {
            updateCell(
              {
                image: { src, width, height, description: caption },
                type: "image",
              },
              rowIndex,
              colIndex,
            );
          } else if (isMasonry) {
            const data = images.map((image) => {
              const width = image.width || 0;
              const height = image.height || 0;
              const isPortrait = width / height < 1;
              const aspectRatio = isPortrait ? 9 / 16 : 16 / 9;
              return { ...image, aspectRatio, id: createId() };
            });
            updateCell(
              {
                masonry: [...(item.masonry ?? []), ...data],
                type: "masonry",
              },
              rowIndex,
              colIndex,
            );
          }
        }}
      />
    </div>
  );
};
