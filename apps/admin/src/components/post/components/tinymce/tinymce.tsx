import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef, useState } from "react";
import "./core";

import FileExplorer from "@/components/file-explorer";

import { basePath } from "@/constants";

import { socket } from "./socket";
import { insertImageInEditor } from "../commands";
import { textPatterns } from "../textPatterns";
import { usePostContext } from "../..";

interface Props {
  text: string;
  onChange: (_html: string) => void;
  style?: string;
}

const LpEditor: React.FC<Props> = ({ text, onChange, style }) => {
  const {
    setHelpers,
    onMediaBrowse,
    fileExplorerOpen,
    onFileExplorerClose,
    helpers,
  } = usePostContext();
  const editorRef = useRef<Editor["editor"]>(null);
  const isDark = document.body.classList.contains("dark");
  const [html, setHtml] = useState(text);
  const contentLoadedRef = useRef(false);

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
    if (editorRef.current) {
      editorRef.current.on("openFileExplorer", () => {
        onMediaBrowse();
      });
    }
    return () => {
      editorRef.current?.off("openFileExplorer");
    };
  }, [onMediaBrowse, editorRef.current]);

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
            editor.on("SelectionChange", function () {
              let node = editor.selection.getNode();
              const prevNode = editor
                .getDoc()
                .querySelector("[data-id='image-focussed']");
              if (prevNode) {
                prevNode.removeAttribute("data-id");
              }
              if (node.nodeName === "IMG" && node.parentElement) {
                node = node.parentElement;
              }
              if (node.nodeName === "FIGURE") {
                node.setAttribute("data-id", "image-focussed");
              }
            });
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
        init={{
          image_caption: true,
          paste_preprocess: function (pl, o) {
            o.content = o.content
              .replace(/<div(.*?)>(.*?)<\/div>/gi, "<p$1>$2</p>")
              .replace(/(.*?)<br\s?\/?>/gi, "<p>$1</p>");
          },
          content_style: style,
          min_height: 300,
          menubar: false,
          link_title: false,
          link_quicklink: true,
          target_list: [
            { title: "None", value: "" },
            { title: "Same page", value: "_self" },
            { title: "New page", value: "_blank" },
          ],
          toolbar: false,
          browser_spellcheck: true,
          contextmenu: false,
          socket,
          branding: false,
          plugins:
            "lists image link quickbars autoresize  code codesample directionality wordcount",
          skin: "none",
          skin_url: basePath + "/skins/ui/" + (isDark ? "oxide-dark" : "oxide"),
          content_css: basePath + "/css/editor.css",
          height: "100%",
          quickbars_image_toolbar: false,
          quickbars_selection_toolbar:
            "h1 h2 mark bold italic underline link nlpcheck nlpremove ltr rtl",
          quickbars_insert_toolbar:
            "bullist numlist blockquote hr codesample customImage image",
          statusbar: false,
          formats: {
            hilitecolor: {
              inline: "code",
              remove_similar: true,
            },
          },
          text_patterns: textPatterns,
          onpageload: () => {
            editorRef.current?.dom.doc
              .querySelectorAll("img")
              .forEach((e) => e.removeAttribute("srcset"));
          },
          setup: function (editor) {
            editor.ui.registry.addButton("mark", {
              icon: "highlight-bg-color",
              onAction: function (_) {
                editor.execCommand("HiliteColor", false, "");
              },
            });
            editor.on("init", function () {
              setTimeout(() => {
                editor.dom.doc
                  ?.querySelectorAll("img")
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
      <FileExplorer
        multi={true}
        isVisible={!!fileExplorerOpen}
        handleCancel={onFileExplorerClose}
        onInsert={(images) => {
          helpers && insertImageInEditor(helpers, images);
          onFileExplorerClose();
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
