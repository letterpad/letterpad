import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef } from "react";
import "./core";

import { useIsPaidMember } from "@/hooks/useIsPaidMember";

import { FileExplorer } from "@/components/file-explorer";
import { useGetProModal } from "@/components/get-pro-modal-provider";

import { blogEditorConfig, id } from "./config";
import { insertImageInEditor } from "../commands";
import { usePostContext } from "../../context";
import { useActivateEditorChangeAfterClick } from "../../hooks";

interface Props {
  text: string;
  onChange: (_html: string) => void;
  style?: string;
  hasAiKey: boolean;
}

export const LpEditor: React.FC<Props> = memo(
  ({ text, onChange, hasAiKey }) => {
    const {
      onMediaBrowse,
      fileExplorerOpen,
      onFileExplorerClose,
      helpers,
      setHelpers,
    } = usePostContext();
    const editorRef = useRef<Editor["editor"]>();
    const isDark = document.body.classList.contains("dark");
    const textRef = useRef("");
    const allowEditorChange = useActivateEditorChangeAfterClick();
    const isPaidMember = useIsPaidMember();
    const { setIsOpen } = useGetProModal();

    useEffect(() => {
      if (!allowEditorChange) {
        textRef.current = text === "undefined" ? "" : text;
      }
    }, [allowEditorChange, text]);

    useEffect(() => {
      const editor = editorRef.current;
      if (editor) {
        editor.on("openFileExplorer", () => {
          onMediaBrowse();
        });
      }
      return () => {
        editor?.off("openFileExplorer");
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onMediaBrowse, editorRef.current]);

    return (
      <div>
        <Editor
          id={id}
          onInit={async (_evt, editor) => {
            if (editor) {
              editorRef.current = editor;
              setHelpers && setHelpers(editor);
            }
          }}
          initialValue={textRef.current}
          onEditorChange={(newHtml) => {
            if (allowEditorChange) {
              onChange(newHtml);
            }
          }}
          licenseKey="gpl"
          init={blogEditorConfig({
            isDark,
            editorRef,
            hasAiKey,
            isPaidMember: false,
            openProModal: () => setIsOpen(true),
          })}
        />
        <FileExplorer
          multi={true}
          isVisible={!!fileExplorerOpen}
          handleCancel={onFileExplorerClose}
          onInsert={(images) => {
            helpers && insertImageInEditor(helpers, images);
            onFileExplorerClose();
          }}
        />
      </div>
    );
  }
);
LpEditor.displayName = "LpEditor";
export default LpEditor;
