import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef, useState } from "react";
import { usePostContext } from "../context";
import { basePath } from "@/constants";
import { textPatterns } from "./textPatterns";
// import tippy from "tippy.js";
// import { data } from "./data";
import MarkMistakes from "./mistakes";

interface Props {
  text: string;
}

const LpEditor: React.FC<Props> = ({ text }) => {
  const { setHelpers, onMediaBrowse, setPostAttribute } = usePostContext();
  const editorRef = useRef<Editor["editor"]>(null);
  const isDark = document.body.classList.contains("dark");
  const [html, setHtml] = useState(text);
  useEffect(() => {
    if (typeof html == "undefined") {
      setHtml(text);
    }
  }, [text]);

  return (
    <>
      <Editor
        onInit={(_evt, editor) => {
          if (editor) {
            //@ts-ignore
            // languagePlugin(window.tinymce);
            //@ts-ignore
            editorRef.current = editor;
            const className = isDark ? "dark" : "light";
            const body = editor.getDoc().body;
            body.classList.remove("dark", "light");
            body.classList.add(className);
            setHelpers && setHelpers(editor);

            const domBody = editor.getDoc();
            var script = domBody.createElement("script");
            script.type = "text/javascript";
            script.src = "https://unpkg.com/@popperjs/core@2";

            domBody.head.appendChild(script);

            var script = domBody.createElement("script");
            script.type = "text/javascript";
            script.src = "https://unpkg.com/tippy.js@6";

            domBody.head.appendChild(script);
          }
        }}
        initialValue={html}
        onEditorChange={(html) => {
          setPostAttribute && setPostAttribute({ html });
        }}
        apiKey="6xxqtl14jlwud6hysqri2xt2pp3lj38je5qys05c17ij7oai"
        init={{
          menubar: false,
          toolbar: false,
          browser_spellcheck: true,
          contextmenu: false,
          plugins:
            "lists link paste emoticons quickbars hr image autoresize  code codesample textpattern",
          skin: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "oxide-dark"
            : "",
          content_css: basePath + "/css/editor.css",
          icons: "thin",
          height: "100%",
          quickbars_selection_toolbar:
            "h1 h2 bold italic underline quicklink nlpcheck nlpremove",
          quickbars_insert_toolbar:
            "bullist numlist blockquote hr codesample customImage",
          statusbar: false,
          textpattern_patterns: textPatterns,
          setup: function (editor) {
            editor.ui.registry.addButton("customImage", {
              icon: "image",
              onAction: function (_) {
                onMediaBrowse && onMediaBrowse();
              },
            });
            editor.ui.registry.addButton("nlpremove", {
              text: "Remove Spell",
              onAction: function (_) {
                const domBody = editor.getDoc().body;

                domBody.querySelectorAll("mark").forEach((spanElmt) => {
                  spanElmt.outerHTML = spanElmt.innerHTML;
                });
                editor.setContent(domBody.innerHTML);
              },
            });
            editor.ui.registry.addButton("nlpcheck", {
              text: "Spell Check",
              onAction: async function (_) {
                const markMistakes = new MarkMistakes(editor);
                markMistakes.run();
                editor
                  .getWin()
                  //@ts-ignore
                  .tippy("[data-tippy-content]", { allowHTML: true });
              },
            });
            setTimeout(() => {
              //@ts-ignore
              editor.getWin().tippy &&
                editor
                  .getWin()
                  //@ts-ignore
                  .tippy("[data-tippy-content]", {
                    allowHTML: true,
                    theme: "light",
                  });
            }, 2000);
          },
          entity_encoding: "raw",
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
