import Katex from "katex";
import {
  defaultTreeAdapter,
  DefaultTreeAdapterMap,
  parseFragment,
} from "parse5";

type DocumentFragment = DefaultTreeAdapterMap["documentFragment"];
type Element = DefaultTreeAdapterMap["element"];

export function transformHtml(ast: DocumentFragment): DocumentFragment {
  let result = transformKatex(ast);
  result = transformPrism(result);
  markSourceLists(result);
  return result;
}

function markSourceLists(ast: DocumentFragment) {
  const blocks = ast.childNodes.filter(
    (node) =>
      !defaultTreeAdapter.isCommentNode(node) &&
      !(defaultTreeAdapter.isTextNode(node) && !node.value.trim())
  );
  for (const [index, heading] of blocks.entries()) {
    if (
      !defaultTreeAdapter.isElementNode(heading) ||
      !/^h[2-6]$/.test(heading.tagName)
    )
      continue;
    const list = blocks[index + 1];
    if (
      !list ||
      !defaultTreeAdapter.isElementNode(list) ||
      (list.tagName !== "ul" && list.tagName !== "ol")
    )
      continue;
    if (!/^(sources|references)\s*:?$/i.test(textContent(heading).trim()))
      continue;
    addClass(heading, "article-sources-heading");
    addClass(list, "article-sources-list");
  }
}

function textContent(el: Element): string {
  return el.childNodes
    .map((node) => {
      if (defaultTreeAdapter.isTextNode(node)) return node.value;
      return defaultTreeAdapter.isElementNode(node) ? textContent(node) : "";
    })
    .join("");
}

function addClass(el: Element, className: string) {
  const classes = el.attrs.find(({ name }) => name === "class");
  if (!classes) {
    el.attrs.push({ name: "class", value: className });
  } else if (!classes.value.split(/\s+/).includes(className)) {
    classes.value += " " + className;
  }
}

function transformKatex(ast: DocumentFragment) {
  for (const node of ast.childNodes) {
    if (node.nodeName === "p" && isLatexNode(node)) {
      const latex = node.attrs.find(
        (attr) => attr.name === "data-latex"
      )?.value!;
      const newHtml = Katex.renderToString(latex, {
        output: "html",
        throwOnError: false,
      });
      const newSubAst = parseFragment(newHtml);
      node.childNodes = newSubAst.childNodes;
    }
  }
  return ast;
}

function transformPrism(ast: DocumentFragment) {
  return ast;
}

function isLatexNode(node: Element) {
  return (
    node.attrs.some(
      (attr) =>
        attr.name === "class" &&
        attr.value.split(" ").includes("letterpad-katex")
    ) && node.attrs.some((attr) => attr.name === "data-latex")
  );
}
