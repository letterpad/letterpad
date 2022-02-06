import { Editor } from "@tinymce/tinymce-react";
import { memo, useRef } from "react";
import { usePostContext } from "../context";
import { basePath } from "@/constants";
import { textPatterns } from "./textPatterns";

interface Props {
  text: string;
}

const LpEditor: React.FC<Props> = ({ text }) => {
  const { setHelpers, onMediaBrowse, setPostAttribute } = usePostContext();
  const editorRef = useRef<Editor["editor"]>(null);
  const isDark = document.body.classList.contains("dark");

  return (
    <>
      <Editor
        onInit={(_evt, editor) => {
          if (editor) {
            //@ts-ignore
            editorRef.current = editor;
            const className = isDark ? "dark" : "light";
            const body = editor.getDoc().body;
            body.classList.remove("dark", "light");
            body.classList.add(className);
            setHelpers && setHelpers(editor);
          }
        }}
        value={text}
        onEditorChange={(html) => {
          setPostAttribute && setPostAttribute({ html });
        }}
        apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
        init={{
          menubar: false,
          toolbar: false,
          plugins:
            "lists link paste emoticons quickbars hr image autoresize  code codesample customImage textpattern toc",
          skin: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "oxide-dark"
            : "",
          content_css: basePath + "/css/editor.css",
          icons: "thin",
          height: "100%",
          toolbar_mode: "floating",
          quickbars_selection_toolbar: "h1 h2 bold italic underline quicklink",
          quickbars_insert_toolbar:
            "bullist numlist blockquote hr codesample customImage toc",
          statusbar: false,
          textpattern_patterns: textPatterns,
          setup: function (editor) {
            editor.ui.registry.addButton("customImage", {
              icon: "image",
              onAction: function (_) {
                onMediaBrowse && onMediaBrowse();
              },
            });
            editor.ui.registry.getAll();
          },
        }}
      />

      <style jsx global>{`
        .dark iframe {
          margin-bottom: 50px;
          background-color: transparent;
        }
        .tox .tox-edit-area__iframe {
          background-color: transparent !important;
          line-height: 24 !important;
        }
        .tox {
          border: none !important;
        }
      `}</style>
    </>
  );
};

export default memo(LpEditor);
