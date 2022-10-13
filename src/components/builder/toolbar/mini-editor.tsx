import { Editor } from "@tinymce/tinymce-react";
import { basePath } from "next.config";
import { memo, useEffect, useRef, useState } from "react";
import "@/components/post/components/tinymce/core";

interface Props {
  text: string;
  onChange: (_html: string) => void;
  formats: string;
}

const MiniEditor: React.FC<Props> = ({ text, onChange, formats = "" }) => {
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
          font_formats:
            "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
          height: "auto",
          width: "100%",
          placeholder: "Write something...",
          menubar: false,
          content_css: basePath + "/css/editor-mini.css",
          toolbar: false,
          quickbars_selection_toolbar:
            formats ??
            "fontfamily styles | fontsize | bold italic underline strikethrough | alignleft aligncenter alignright  | link codesample code forecolor",
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
