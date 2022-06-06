import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef, useState } from "react";
import "./core";

import { basePath } from "@/constants";

import { socket } from "./socket";
import { initImagePlugin } from "../plugins/image";
import { textPatterns } from "../textPatterns";
import { usePostContext } from "../../context";

interface Props {
  text: string;
  onChange: (_html: string) => void;
}

const LpEditor: React.FC<Props> = ({ text, onChange }) => {
  const { setHelpers, onMediaBrowse } = usePostContext();
  const editorRef = useRef<Editor["editor"]>(null);
  const isDark = document.body.classList.contains("dark");
  const [html, setHtml] = useState(text);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      socket.setChangeHandler(() => {
        const html = editorRef.current?.getBody().innerHTML;
        if (html) {
          editorRef.current?.setContent(html);
          socket.applyTooltip();
          onChange(html);
        }
      });
    }
  }, [onChange]);

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
            socket.setEditor(editorRef.current);
            socket.connectSocketAndAddListeners();

            const className = isDark ? "dark" : "light";
            const body = editor.getDoc().body;
            body.classList.remove("dark", "light");
            body.classList.add(className);
            setHelpers && setHelpers(editor);

            const domBody = editor.getDoc();
            await insertScript("/admin/tippy/popper.min.js", domBody.head);
            await insertScript("/admin/tippy/tippy.min.js", domBody.head);

            socket.applyTooltip();
          }
        }}
        initialValue={html}
        onEditorChange={(html) => {
          const htmlWithBody = `<html><body>${html}</body></html>`;
          if (htmlWithBody === text) return;
          onChange(htmlWithBody);
        }}
        init={{
          menubar: false,
          toolbar: false,
          browser_spellcheck: true,
          contextmenu: false,
          socket,
          branding: false,
          plugins: "lists link quickbars autoresize  code codesample",
          skin: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "oxide-dark"
            : "",
          content_css: basePath + "/css/editor.css",
          height: "100%",
          quickbars_image_toolbar: false,
          quickbars_selection_toolbar:
            "h1 h2 bold italic underline quicklink nlpcheck nlpremove",
          quickbars_insert_toolbar:
            "bullist numlist blockquote hr codesample customImage",
          statusbar: false,
          text_patterns: textPatterns,
          onpageload: () => {
            editorRef.current?.dom.doc
              .querySelectorAll("img")
              .forEach((e) => e.removeAttribute("srcset"));
          },
          setup: function (editor) {
            initImagePlugin(editor, { onMediaBrowse });
            editor.on("init", function () {
              setTimeout(() => {
                editor.dom.doc
                  .querySelectorAll("img")
                  .forEach((e) => e.removeAttribute("srcset"));
              }, 1000);
            });
          },
          entity_encoding: "raw",
          codesample_global_prismjs: true,
          codesample_languages: [
            { text: "Bash", value: "bash" },
            { text: "C", value: "c" },
            { text: "C#", value: "csharp" },
            { text: "C++", value: "cpp" },
            { text: "CSS", value: "css" },
            { text: "HTML/XML", value: "markup" },
            { text: "Java", value: "java" },
            { text: "JavaScript", value: "javascript" },
            { text: "Markdown", value: "markdown" },
            { text: "PHP", value: "php" },
            { text: "Python", value: "python" },
            { text: "R", value: "r" },
            { text: "Regex", value: "regex" },
            { text: "Ruby", value: "ruby" },
            { text: "Rust", value: "rust" },
            { text: "Sql", value: "sql" },
          ],
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
        .tox-editor-header {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default memo(LpEditor);

const insertScript = (src: string, head: HTMLHeadElement) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    script.onabort = resolve;
    head.appendChild(script);
  });
};
