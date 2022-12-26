import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import { Editor } from "@tinymce/tinymce-react";
import { memo, useEffect, useRef, useState } from "react";
import "./core";

import FileExplorer from "@/components/file-explorer";

import { basePath } from "@/constants";

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
    onMediaBrowse,
    fileExplorerOpen,
    onFileExplorerClose,
    helpers,
    setHelpers,
  } = usePostContext();
  const editorRef = useRef<Editor["editor"]>(null);
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
    <div className="serif prose dark:prose-dark">
      <GrammarlyEditorPlugin clientId="client_BuJhZ29Gc2ovQLpvEUvjJ8">
        <Editor
          onInit={async (_evt, editor) => {
            if (editor) {
              //@ts-ignore
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
          init={{
            inline: true,
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
            branding: false,
            plugins:
              "lists image link quickbars autoresize  code codesample directionality wordcount",
            skin: "none",
            skin_url:
              basePath + "/skins/ui/" + (isDark ? "oxide-dark" : "oxide"),
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
            paste_remove_styles: true,
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
    </div>
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
