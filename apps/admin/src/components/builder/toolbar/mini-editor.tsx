import { Editor } from "@tinymce/tinymce-react";
import { basePath } from "next.config";
import { useEffect, useRef, useState } from "react";
import "@/components/post/components/tinymce/core";

interface Props {
  text: string;
  onChange: (_html: string) => void;
  formats: string;
}
const isBrowser = typeof window !== "undefined";

const MiniEditor: React.FC<Props> = ({ text, onChange, formats = "" }) => {
  const editorRef = useRef<Editor["editor"]>(null);
  const isDark = isBrowser && document.body.classList.contains("dark");
  const [html, setHtml] = useState(text);

  useEffect(() => {
    if (typeof html == "undefined") {
      setHtml(text);
    }
  }, [html, text]);

  return (
    <div className="editor-wrapper  w-full">
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
          font_family_formats:
            "Anonymous Pro=Anonymous Pro; Bowlby One SC=Bowlby One SC; Bungee Inline=Bungee Inline; Caveat=Caveat; Germania One=Germania One; Knewave=Knewave; Major Mono Display=Major Mono Display; Merriweather=Merriweather; Nanum Pen Script=Nanum Pen Script; Niconne=Niconne; PT Sans=PT Sans; Raleway=Raleway; Roboto=Roboto; Skranji=Skranji; Spectral=Spectral;Farsan=Farsan; Potta One=Potta One; Metal Mania=Metal Mania",
          height: "auto",
          width: "100%",
          placeholder: "....[ text ]....",
          menubar: false,
          content_css: basePath + "/css/editor-mini.css",
          toolbar: false,
          quickbars_insert_toolbar: false,
          fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
          quickbars_selection_toolbar:
            formats ??
            "fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright | codesample code forecolor",
          inline: true,
          browser_spellcheck: false,
          contextmenu: false,
          branding: false,
          plugins: "link code quickbars autoresize",
          skin:
            isBrowser &&
            window.matchMedia("(prefers-color-scheme: light)").matches
              ? "oxide-dark"
              : "",
          //   toolbar_location: "bottom",
          statusbar: false,
          entity_encoding: "raw",
          content_style: "body { padding: 4px 12px }",
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
        #creative .editor-wrapper a {
          font-family: inherit;
          font-size: inherit;
        }
        .mce-content-body {
          min-width: 100px;
        }
      `}</style>
    </div>
  );
};

export default MiniEditor;
