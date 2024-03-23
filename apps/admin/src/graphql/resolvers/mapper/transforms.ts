import { parseFragment, DefaultTreeAdapterMap } from "parse5";
import Katex from "katex";

type DocumentFragment = DefaultTreeAdapterMap["documentFragment"];
type Element = DefaultTreeAdapterMap["element"];

export function transformHtml(ast: DocumentFragment): DocumentFragment {
  let result = transformKatex(ast);
  result = transformPrism(result);
  return result;
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
