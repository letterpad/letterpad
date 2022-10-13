import { FC, useState } from "react";

import FileExplorer from "@/components/file-explorer";

import { SectionImage } from "./image";
import { SectionText } from "./text";
import { useBuilderContext } from "../../context";
import { ContentToolbar } from "../../toolbar";
// import { IconImage } from "../../toolbar/icons";
import { Block } from "../../types";

interface Props {
  row?: Block;
  columns: number;
  rowIndex: number;
  colIndex: number;
}
export const Cell: FC<Props> = ({ row, columns, rowIndex, colIndex }) => {
  const { preview, updateCell } = useBuilderContext();
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [formats, setFormats] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const item = row?.data[colIndex];
  // const showImgBtnCenter =
  //   !item?.image?.src && isImage && !preview && item.text?.trim().length === 0;

  return (
    <div className="relative w-full flex justify-center align-middle">
      {!preview && (
        <ContentToolbar
          setEditorOpen={(visible) => {
            setFormats(
              "h1 h2 | fontfamily alignleft aligncenter alignright | blockquote | forecolor",
            );
            setEditorOpen(visible);
          }}
          editorOpen={editorOpen}
          item={item}
          setFileExplorerOpen={setFileExplorerOpen}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />
      )}
      <div className="w-full">
        {item?.type === "text" && (
          <SectionText
            columns={columns}
            item={item}
            editable={editorOpen}
            position={[rowIndex, colIndex]}
            formats={formats}
          />
        )}
        {item?.type === "image" && (
          <SectionImage
            item={item}
            columns={columns}
            position={[rowIndex, colIndex]}
            formats={formats}
            editable={editorOpen}
            cover={row?.cover}
          />
        )}
      </div>
      <FileExplorer
        multi={true}
        isVisible={!!fileExplorerOpen}
        handleCancel={() => setFileExplorerOpen(false)}
        onInsert={(image) => {
          setFileExplorerOpen(false);
          const { src, width, height, caption } = image[0];
          updateCell(
            {
              image: { src, width, height, description: caption },
              type: "image",
            },
            rowIndex,
            colIndex,
          );
        }}
      />
    </div>
  );
};
