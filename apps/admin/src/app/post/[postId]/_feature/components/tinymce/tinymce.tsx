import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef, useState } from "react";
import "./core";

import { FileExplorer } from "@/components/file-explorer";

import { blogEditorConfig, id } from "./config";
import { insertImageInEditor } from "../commands";
import { usePostContext } from "../../context";

interface Props {
  text: string;
  onChange: (_html: string) => void;
  style?: string;
}

export const LpEditor: React.FC<Props> = memo(({ text, onChange, style }) => {
  const {
    onMediaBrowse,
    fileExplorerOpen,
    onFileExplorerClose,
    helpers,
    setHelpers,
  } = usePostContext();
  const editorRef = useRef<Editor["editor"]>();
  const isDark = document.body.classList.contains("dark");
  const [html, setHtml] = useState(text);
  const contentLoadedRef = useRef(false);

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
  }, [onMediaBrowse, editorRef.current]);

  useEffect(() => {
    if (typeof html == "undefined") {
      setHtml(text);
    }
  }, [html, text]);

  return (
    <div>
      <GrammarlyEditorPlugin clientId="client_BuJhZ29Gc2ovQLpvEUvjJ8">
        <Editor
          id={id}
          onInit={async (_evt, editor) => {
            if (editor) {
              editorRef.current = editor;
              setHelpers && setHelpers(editor);
            }
          }}
          initialValue={html}
          onEditorChange={(newHtml) => {
            if (contentLoadedRef.current) {
              onChange(newHtml);
            } else {
              contentLoadedRef.current = true;
            }
          }}
          init={blogEditorConfig({ isDark, editorRef })}
        />
      </GrammarlyEditorPlugin>
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
});
LpEditor.displayName = "LpEditor";
export default LpEditor;
