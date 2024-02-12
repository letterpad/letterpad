import { IProps } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";

import { basePath } from "@/constants";

import { textPatterns } from "../textPatterns";

export const id = "main-editor";
export const titleId = "title-editor";
export const subTitleId = "sub-title-editor";

export const subTitleEditorConfig: IProps["init"] = {
  menubar: false,
  toolbar: false,
  placeholder: "Optional sub-title of your post...",
  inline: true,
  content_style: `#${subTitleId} { font-size: 1.1rem; line-height: 1.3rem; font-weight: 500; color: rgba(var(--color), 0.5) }; `,
  setup: function (ed) {
    ed.on("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const main: HTMLDivElement | null = document.querySelector(`#${id}`);
        main?.focus();
      }
    });
    ed.on("keypress", function (_e) {
      const length = ed.getContent({ format: "text" }).length;
      if (length > 140) return false;
    });
  },
};

export const titleEditorConfig: IProps["init"] = {
  menubar: false,
  toolbar: false,
  placeholder: "Title",
  inline: true,
  content_style: `#${titleId} p, #${titleId}::before { font-size: 3rem;  line-height: 3rem; font-weight: 700; margin-bottom: 1rem; }`,
  setup: function (ed) {
    ed.on("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const main: HTMLDivElement | null = document.querySelector(
          `#${subTitleId}`
        );
        main?.focus();
      }
      const length = ed.getContent({ format: "text" }).length;
      if (length > 140) return false;
    });
  },
};

export const blogEditorConfig = ({
  isDark,
  editorRef,
  hasAiKey,
}): IProps["init"] => ({
  placeholder: "Write your story here...",
  inline: true,
  image_caption: true,
  paste_preprocess: function (pl, o) {
    o.content = o.content
      .replace(/<div(.*?)>(.*?)<\/div>/gi, "<p$1>$2</p>")
      .replace(/(.*?)<br\s?\/?>/gi, "<p>$1</p>");
  },
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
    "lists image ai link quickbars autoresize  code codesample directionality wordcount",
  skin: "none",
  skin_url: basePath + "/skins/ui/" + (isDark ? "oxide-dark" : "oxide"),
  height: "100%",
  quickbars_image_toolbar: false,
  quickbars_selection_toolbar:
    "h1 h2 mark bold italic underline link nlpcheck nlpremove ltr rtl",
  quickbars_insert_toolbar:
    "bullist numlist blockquote hr codesample customImage image aiButton",
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
    if (!hasAiKey) {
      editor.ui.registry.addButton("aiButton", {
        text: "AI",
        tooltip: "Autocomplete with AI",
        onAction: () => {
          editor.windowManager.open({
            title: "Autocomplete with AI",
            body: {
              type: "panel",
              items: [
                {
                  type: "htmlpanel", // A HTML panel component
                  html: "You can use AI to autocomplete your text by simply typing +++. To enable this feature, updated the OpenAI Key in <a href='/settings?selected=openai' target='_blank'>settings</a> ",
                },
              ],
            },
            buttons: [
              {
                type: "cancel",
                text: "OK",
              },
            ],
          });
        },
      });
    }
    // editor.on("init", function () {
    //   setTimeout(() => {
    //     editor.dom.doc
    //       ?.querySelectorAll("img")
    //       .forEach((e) => e.removeAttribute("srcset"));
    //   }, 1000);
    // });
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
    { text: "Kotlin", value: "kotlin" },
    { text: "Markdown", value: "markdown" },
    { text: "PHP", value: "php" },
    { text: "Python", value: "python" },
    { text: "R", value: "r" },
    { text: "Regex", value: "regex" },
    { text: "Ruby", value: "ruby" },
    { text: "Rust", value: "rust" },
    { text: "Sql", value: "sql" },
  ],
});
