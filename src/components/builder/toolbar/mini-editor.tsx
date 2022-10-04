import { Editor } from "@tinymce/tinymce-react";
import { basePath } from "next.config";
import { memo, useEffect, useRef, useState } from "react";
import "@/components/post/components/tinymce/core";

interface Props {
  text: string;
  onChange: (_html: string) => void;
}

const MiniEditor: React.FC<Props> = ({ text, onChange }) => {
  const editorRef = useRef<Editor["editor"]>(null);
  const isDark = document.body.classList.contains("dark");
  const [html, setHtml] = useState(text);

  useEffect(() => {
    if (typeof html == "undefined") {
      setHtml(text);
    }
  }, [html, text]);

  return (
    <>
      <Editor
        onInit={async (_evt, editor) => {
          if (editor) {
            //@ts-ignore
            editorRef.current = editor;

            const className = isDark ? "dark" : "light";
            const body = editor.getDoc().body;
            body.classList.remove("dark", "light");
            body.classList.add(className);
          }
        }}
        initialValue={html}
        onEditorChange={(html) => {
          const htmlWithBody = `<html><body>${html}</body></html>`;
          if (htmlWithBody === html) return;

          onChange(htmlWithBody);
        }}
        init={{
          height: "auto",
          width: "100%",
          menubar: false,
          content_css: basePath + "/css/editor.css",
          toolbar: false,
          quickbars_selection_toolbar:
            "h1 h2 h3 h4 | bold italic underline strikethrough | alignleft aligncenter alignright  | link codesample code forecolor",
          inline: true,
          browser_spellcheck: false,
          contextmenu: false,
          branding: false,
          plugins: "link code textcolor quickbars autoresize",
          skin: window.matchMedia("(prefers-color-scheme: light)").matches
            ? "oxide-dark"
            : "",
          //   toolbar_location: "bottom",
          statusbar: false,
          entity_encoding: "raw",
          content_style: "body { padding: 4px 12px; }",
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

export default memo(MiniEditor);
