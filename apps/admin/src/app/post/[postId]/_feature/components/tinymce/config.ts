import { IProps } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";

import { basePath } from "@/constants";
import { EventAction, track } from "@/track";

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
  license_key: "gpl",
  inline: true,
  skin: false,
  theme: false,
  content_style: `#${titleId} p, #${titleId}::before { font-size: 3rem;  line-height: 3rem; font-weight: 700; margin-bottom: 1rem }`,
  setup: function (ed) {
    ed.on("init", function () {
      ed.focus()
    });
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
  if (node.tagName === "IMG") {
    node.removeAttribute("srcset");
  }
  if (node.getAttribute("data-mce-bogus") || node.tagName === "BUTTON") {
    node.parentNode?.removeChild(node);
  }

  let parentElem = node.parentElement;
  while (parentElem) {
    if (parentElem.nodeName === "PRE") {
      const childEle = parentElem.children[0] as HTMLElement;
      const parentClass = parentElem.getAttribute("class");
      const childClass = childEle?.getAttribute("class");

      if (!parentClass?.startsWith("language")) {
        if (childClass?.startsWith("language")) {
          parentElem.setAttribute("class", childClass);
        } else {
          parentElem.setAttribute("class", "language-javascript");
        }
      }
      const lang =
        parentClass?.split("-")[1] || childClass?.split("-")[1] || "plain";
      parentElem.innerHTML = parentElem.innerHTML?.replaceAll("<br>", "\n");
      const code = parentElem.innerText?.replaceAll("\n", "\r\n");
      if (code) {
        const highlight = window.Prism.highlight(
          code,
          window.Prism.languages[lang],
          lang
        );
        parentElem.innerHTML = `<code class="language-javascript">${highlight}</code>`;
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
  childNodes.forEach((child) => modifyElements(child));
}

export const blogEditorConfig = ({
  isDark,
  editorRef,
  isPaidMember,
  openProModal
}): IProps["init"] => ({
  placeholder: "Write your story here...",
  inline: true,
  image_caption: true,
  paste_preprocess: function (pl, o) {
    try {
      new URL(o.content);
      const html = convertToEmbed(o.content);
      pl.execCommand("mceInsertContent", false, html);

      // @ts-ignore
      o.preventDefault();
      return;
    } catch (e) {
      //
    }

    o.content = o.content.replace(/<div(.*?)>(.*?)<\/div>/gi, "<p$1>$2</p>");
    // .replace(/(.*?)<br\s?\/?>/gi, "<p>$1</p>");

    const tempElement = document.createElement("div");
    tempElement.innerHTML = o.content;

    const nodes = Array.from(tempElement.children);
    if (tempElement.children.length === 0) {
      return;
    }
    nodes.forEach((elem) => modifyElements(elem));
    let content = nodes.map((node) => node.outerHTML).join("");
    if (content === "<meta>" || !content) {
      content = tempElement.innerText;
    }

    pl.execCommand("mceInsertContent", false, content);

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
  link_context_toolbar: true,
  plugins:
    "lists image aiCompletion ai tableofcontents link quickbars autoresize code codesample wordcount latex",
  // skin: "none",
  skin_url: basePath + "/skins/ui/" + (isDark ? "oxide-dark" : "oxide"),
  height: "100%",
  quickbars_image_toolbar: false,
  quickbars_selection_toolbar:
    "h1 h2 mark bold italic underline link",
  quickbars_insert_toolbar:
    "aidialog postOutline bullist numlist blockquote hr codesample customImage image latex tableofcontents",
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
    editorRef.current?.dom?.doc?.querySelectorAll("img")
      .forEach((e) => e.removeAttribute("srcset"));
  },
  ai_shortcuts: [
    { title: 'Tidy up', prompt: 'Format this content, remove empty paragraphs, add headings for paragraphs if there are no headings, extra spaces, alignment, indentation, heading hirerchy, consistency without changing the meaning or losing any key information.', selection: true },
    { title: 'Summarize content', prompt: 'Provide the key points and concepts in this content in a succinct summary.', selection: true },
    { title: 'Improve writing', prompt: 'Rewrite this content with no spelling mistakes, proper grammar, and with more descriptive language, using best writing practices without losing the original meaning.', selection: true },
    { title: 'Simplify language', prompt: 'Rewrite this content with simplified language and reduce the complexity of the writing, so that the content is easier to understand.', selection: true },
    { title: 'Expand upon', prompt: 'Expand upon this content with descriptive language and more detailed explanations, to make the writing easier to understand and increase the length of the content.', selection: true },
    { title: 'Trim content', prompt: 'Remove any repetitive, redundant, or non-essential writing in this content without changing the meaning or losing any key information.', selection: true },
    {
      title: 'Change tone', subprompts: [
        { title: 'Professional', prompt: 'Rewrite this content using polished, formal, and respectful language to convey professional expertise and competence.', selection: true },
        { title: 'Casual', prompt: 'Rewrite this content with casual, informal language to convey a casual conversation with a real person.', selection: true },
        { title: 'Direct', prompt: 'Rewrite this content with direct language using only the essential information.', selection: true },
        { title: 'Confident', prompt: 'Rewrite this content using compelling, optimistic language to convey confidence in the writing.', selection: true },
        { title: 'Friendly', prompt: 'Rewrite this content using friendly, comforting language, to convey understanding and empathy.', selection: true },
      ]
    },
    {
      title: 'Change style', subprompts: [
        { title: 'Business', prompt: 'Rewrite this content as a business professional with formal language.', selection: true },
        { title: 'Legal', prompt: 'Rewrite this content as a legal professional using valid legal terminology.', selection: true },
        { title: 'Journalism', prompt: 'Rewrite this content as a journalist using engaging language to convey the importance of the information.', selection: true },
        { title: 'Medical', prompt: 'Rewrite this content as a medical professional using valid medical terminology.', selection: true },
        { title: 'Poetic', prompt: 'Rewrite this content as a poem using poetic techniques without losing the original meaning.', selection: true },
      ]
    }
  ],
  ai_request: (request, respondWith) => {
    if (!isPaidMember) {
      editorRef.current.execCommand('mceAiDialogClose');
      return openProModal();
    }
    respondWith.string((signal) => window.fetch('/api/generate', {
      signal, method: "POST", headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: request.prompt,
        field: "post",
      }),
    })
      .then(async (response) => {
        if (response) {
          const data = await response.json();
          if (data.error) {
            throw new Error(`${data.error.type}: ${data.error.message}`);
          } else if (response.ok) {
            return data?.choices[0]?.message?.content?.trim();
          }
        } else {
          throw new Error('Failed to communicate with the ChatGPT API');
        }
      })
    );
  },
  setup: function (editor) {
    editor.ui.registry.addIcon('outline', '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,120v88a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h88a8,8,0,0,1,0,16H48V208H208V120a8,8,0,0,1,16,0Z"></path></svg>');


    editor.ui.registry.addButton("mark", {
      icon: "highlight-bg-color",
      tooltip: "Highlight Text",
      onAction: function (_) {
        editor.execCommand("HiliteColor", false, "");
      },
    });
    editor.ui.registry.addButton("postOutline", {
      icon: "outline",
      tooltip: "Create Article outline",
      onAction: function (_) {
        editor.windowManager.open({
          title: 'Generate Outline of a Post',
          body: {
            type: 'panel',
            items: [
              {
                type: 'input',
                name: 'title',
                label: 'Enter the title of the post',
              },
            ]
          },
          buttons: [
            {
              type: 'cancel',
              name: 'closeButton',
              text: 'Cancel'
            },
            {
              type: 'submit',
              name: 'submitButton',
              text: 'Generate',
              buttonType: 'primary'
            }
          ],
          initialData: {
            title: '',
          },
          onSubmit(api) {
            const data = api.getData();
            //data.title
            editor.execCommand('mceAiDialog', true, { prompt: `Generate an outline for the post - ${data.title}. Ensure each headlines and its points flows logically and contributes to the overall flow of the post.`, generate: true, display: true });
            api.close();
            editor.focus();
          },
        });
      },
    });
    editor.on('beforeExecCommand', function (args) {
      if (isPaidMember) return;
      if (args.command === "mceUpdateToc" || args.command === "mceInsertToc") {
        args.preventDefault();
        track({
          eventAction: EventAction.Click,
          eventCategory: "pro-modal",
          eventLabel: `editor`,
        });
        return openProModal();
      }
    });
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
    var embedUrl = "https://www.youtube.com/embed/" + videoId;
    return (
      '<div class="flex justify-center"><iframe width="100%" height="400px" src="' +
      embedUrl +
      '" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div><p></p><p></p>'
    );
  }
  return inputUrl;
}

function extractVideoId(url) {
  var match = url.match(/[?&]v=([^&]+)/);
  return match && match[1];
}