import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
});

/** Render an author-scoped post body. Plain text remains the compatibility default. */
export function renderMcpBody(text, bodyFormat = "plain") {
  if (bodyFormat !== "plain" && bodyFormat !== "markdown") {
    throw new TypeError("body_format must be 'plain' or 'markdown'.");
  }
  if (bodyFormat === "markdown") return markdown.render(text);
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p>${paragraph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>`
    )
    .join("");
}
