import { Editor } from "@tinymce/tinymce-react";
import { basePath } from "next.config";

const blockElements = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ol",
  "ul",
  "li",
  "pre",
  "address",
  "blockquote",
  "dl",
  "div",
];

export default class MarkMistakes {
  private editor: Editor["editor"];
  resultContent = "";
  correctionPositions = {};

  constructor(editor: Editor["editor"]) {
    this.editor = editor;
  }

  async run() {
    if (!this.editor) {
      throw new Error("Editor instance not found");
    }
    let content = this.editor.getContent({ format: "text" });
    content = content.replace(/\n\n/g, "\n");
    const data = await this._api(content);

    data.matches.forEach((match, index) => {
      this.correctionPositions[match.offset] = {
        offset: match.offset,
        length: match.length,
        index,
        match,
      };
    });
    this.mark();
  }

  mark() {
    if (!this.editor) {
      throw new Error("Editor instance not found");
    }
    let contentHtml = this.editor.getContent(); //.replace(/\n/, "");
    const contentLength = contentHtml.length;
    let tagCount = 0;
    let offset = 0;

    let offsetEnd = 0;

    for (let i = 0; i < contentLength; i++) {
      //
      const letter = contentHtml[i];

      if (letter == "\n") {
        continue;
      } else if (letter == "<") {
        tagCount++;

        this.resultContent += letter;
        continue;
      } else if (letter == ">") {
        tagCount--;
        this.resultContent += letter;
        continue;
      } else if (tagCount === 0) {
        if (contentHtml[i - 1] === ">") {
          const tag = this.getLastClosingTag();
          if (tag && blockElements.includes(tag)) {
            offset++;
          }
        }
        const suggestion = this.correctionPositions[offset];
        if (suggestion) {
          const { issueType, description } = suggestion.match.rule;
          const suggestionList = suggestion.match.replacements
            .slice(0, 8)
            .map((suggestion) => {
              return suggestion.value;
            })
            .join(", ");
          const tooltip = `${issueType} - ${description} <p>${suggestionList}`;
          this.resultContent += `<mark class="${issueType}" data-tippy-content="${tooltip}" title="${tooltip}">`;
          offsetEnd = suggestion.length + i;
        }
        if (offsetEnd === i) {
          this.resultContent += "</mark>";
        }
        offset++;
        this.resultContent += letter;
      } else {
        this.resultContent += letter;
      }
      console.log(letter, offset);
    }
    this.editor.setContent(this.resultContent);
  }

  async _api(text: string) {
    return fetch(basePath + "/api/grammer", {
      method: "POST",
      body: JSON.stringify({ text }),
    }).then((res) => res.json());
  }

  getLastClosingTag() {
    const start = this.resultContent.lastIndexOf("</");
    const end = this.resultContent.lastIndexOf(">") + 1;
    const lastTag = this.resultContent.substring(start, end);
    const valid = lastTag.match(/<\/(.*?)>/);
    if (valid) {
      return valid[1];
    }
  }
}
