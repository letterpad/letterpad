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
  skin: false,
  theme: false,
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
  skin: false,
  theme: false,
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
    });
  },
};

function modifyElements(node: Element) {
  if (node.tagName === 'IMG') {
    node.removeAttribute('srcset');
  }
  if (node.getAttribute('data-mce-bogus') || node.tagName === "BUTTON") {
    node.parentNode?.removeChild(node)
  }
  let parentElem = node.parentElement;
  while (parentElem) {
    if (parentElem.nodeName === 'PRE') {
      const childEle = parentElem.children[0] as HTMLElement;
      const parentClass = parentElem.getAttribute('class');
      const childClass = childEle?.getAttribute('class');

      if (!parentClass?.startsWith("language")) {
        if (childClass?.startsWith("language")) {
          parentElem.setAttribute('class', childClass)
        } else {
          parentElem.setAttribute('class', "language-javascript")
        }
      }
      const lang = parentClass?.split('-')[1] || childClass?.split('-')[1] || 'plain';
      parentElem.innerHTML = parentElem.innerHTML?.replaceAll('<br>', '\n');
      const code = parentElem.innerText?.replaceAll('\n', '\r\n');
      if (code) {
        const highlight = window.Prism.highlight(code, window.Prism.languages[lang], lang);
        parentElem.innerHTML = `<code class="language-javascript">${highlight}</code>`
      }
      return; // Exit the loop if a <pre> element is found
    }
    parentElem = parentElem.parentElement;
  }
  while (node.attributes.length > 0) {
    node.removeAttribute(node.attributes[0].name);
  }


  // Recursively process child nodes
  const childNodes = Array.from(node.children);
  childNodes.forEach(child => modifyElements(child));
}


export const blogEditorConfig = ({
  isDark,
  editorRef,
  hasAiKey,
}): IProps["init"] => ({
  placeholder: "Write your story here...",
  inline: true,
  image_caption: true,
  skin: false,
  theme: false,
  paste_preprocess: function (pl, o) {

    try {
      new URL(o.content)
      const html = convertToEmbed(o.content);
      pl.execCommand('mceInsertContent', false, html);

      // @ts-ignore
      o.preventDefault();
      return
    } catch (e) {
      //
    }



    o.content = o.content
      .replace(/<div(.*?)>(.*?)<\/div>/gi, "<p$1>$2</p>")
    // .replace(/(.*?)<br\s?\/?>/gi, "<p>$1</p>");

    const tempElement = document.createElement('div');
    tempElement.innerHTML = o.content;

    const nodes = Array.from(tempElement.children);
    if (tempElement.children.length === 0) {
      return;
    }
    nodes.forEach(elem => modifyElements(elem));
    let content = nodes.map(node => node.outerHTML).join('');
    if (content === '<meta>' || !content) {
      content = tempElement.innerText;
    }

    pl.execCommand('mceInsertContent', false, content);

    // @ts-ignore
    o.preventDefault();
  },
  valid_ids: false,
  inline_styles: false,
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
  },
  // valid_elements: '*[*]',
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


function convertToEmbed(inputUrl: string) {
  var videoId = extractVideoId(inputUrl);
  if (videoId) {
    var embedUrl = 'https://www.youtube.com/embed/' + videoId;
    return '<div class="flex justify-center"><iframe width="100%" height="400px" src="' + embedUrl + '" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div><p></p><p></p>';
  }
  return inputUrl;

}

function extractVideoId(url) {
  var match = url.match(/[?&]v=([^&]+)/);
  return match && match[1];
}