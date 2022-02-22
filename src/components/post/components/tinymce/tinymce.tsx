import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef, useState } from "react";
import { usePostContext } from "../../context";
import { basePath } from "@/constants";
import { textPatterns } from "../textPatterns";
import { socket } from "./socket";

interface Props {
  text: string;
}

const LpEditor: React.FC<Props> = ({ text }) => {
  const { setHelpers, onMediaBrowse, setPostAttribute } = usePostContext();
  const editorRef = useRef<Editor["editor"]>(null);
  const isDark = document.body.classList.contains("dark");
  const [html, setHtml] = useState(text);

  useEffect(() => {
    if (editorRef.current) {
      socket.setEditor(editorRef.current);
      socket.connectSocketAndAddListeners();
      socket.setChangeHandler(() => {
        const html = editorRef.current?.getBody().innerHTML;
        if (html) {
          editorRef.current?.setContent(html);
          socket.applyTooltip();
          setPostAttribute && setPostAttribute({ html });
        }
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [editorRef.current]);

  useEffect(() => {
    if (typeof html == "undefined") {
      setHtml(text);
    }
  }, [text]);

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
            setHelpers && setHelpers(editor);

            const domBody = editor.getDoc();
            await insertScript("/admin/tippy/popper.min.js", domBody.head);
            await insertScript("/admin/tippy/tippy.min.js", domBody.head);
            await insertScript(
              "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js",
              domBody.head,
            );
            socket.applyTooltip();
          }
        }}
        initialValue={html}
        onEditorChange={(html) => {
          setPostAttribute && setPostAttribute({ html });
        }}
        // apiKey="6xxqtl14jlwud6hysqri2xt2pp3lj38je5qys05c17ij7oai"
        tinymceScriptSrc="/admin/tinymce/tinymce.min.js"
        init={{
          menubar: false,
          toolbar: false,
          browser_spellcheck: true,
          contextmenu: false,
          socket,
          plugins:
            "lists link paste emoticons quickbars hr image autoresize  code codesample textpattern",
          skin: window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "oxide-dark"
            : "",
          content_css: basePath + "/css/editor.css",
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

const insertScript = (src, head) => {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    script.onabort = resolve;
    head.appendChild(script);
  });
};
