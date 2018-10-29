import Prism from "prismjs";
import { Block, Range } from "slate";
import { isMod } from "../../helper/keyboard-event";

export const hasBlock = (value, type) => {
  return value.blocks.some(node => node.type == type);
};

export const getCodeBlockParent = value => {
  let parentNode = value.anchorBlock;
  do {
    if (parentNode.type === "code_block") {
      return parentNode;
    }
  } while ((parentNode = value.document.getParent(parentNode.key)));
  return null;
};

export const applyCodeblock = change => {
  const codeBlock = getCodeBlockParent(change.value);

  if (codeBlock) {
    const startNode = codeBlock.nodes.get(0).nodes.get(0);
    const lastNode = codeBlock.nodes.get(codeBlock.nodes.size - 1).nodes.get(0);

    change.select(
      Range.create({
        anchorKey: startNode.key,
        anchorOffset: 0,
        focusKey: lastNode.key,
        focusOffset: codeBlock.text.length,
      }),
    );

    change.moveToRangeOf(codeBlock);

    return change
      .removeMark("highlight")
      .unwrapBlockByKey(codeBlock.key, "code_block")
      .focus();
  }

  return change.wrapBlock("code_block");
};

export const decorateNode = node => {
  if (node.type != "code_block") return;
  let language = "javascript";
  if (node.data.get("language")) {
    language = node.data.get("language");
  }
  const grammar = Prism.languages[language];
  const texts = node.getTexts().toArray();

  // Tokenize the whole block text
  const blockText = texts.map(t => t.text).join("\n");
  const tokens = Prism.tokenize(blockText, grammar);

  // The list of decorations to return
  const decorations = [];
  let textStart = 0;
  let textEnd = 0;

  texts.forEach(text => {
    textEnd = textStart + text.text.length;

    let offset = 0;

    const processToken = (token, accu) => {
      accu = accu || "";

      if (typeof token === "string") {
        if (accu) {
          const decoration = createDecoration({
            text,
            textStart,
            textEnd,
            start: offset,
            end: offset + token.length,
            className: `prism-token token ${accu}`,
          });
          if (decoration) {
            decorations.push(decoration);
          }
        }
        offset += token.length;
      } else {
        accu = `${accu} ${token.type} ${token.alias || ""}`;

        if (typeof token.content === "string") {
          const decoration = createDecoration({
            text,
            textStart,
            textEnd,
            start: offset,
            end: offset + token.content.length,
            className: `prism-token token ${accu}`,
          });
          if (decoration) {
            decorations.push(decoration);
          }

          offset += token.content.length;
        } else {
          // When using token.content instead of token.matchedStr, token can be deep
          for (let i = 0; i < token.content.length; i += 1) {
            processToken(token.content[i], accu);
          }
        }
      }
    };

    tokens.forEach(processToken);
    textStart = textEnd + 1; // account for added `\n`
  });

  return decorations;
};
/**
 * Return a decoration range for the given text.
 */
const createDecoration = ({
  text,
  textStart,
  textEnd,
  start,
  end,
  className,
}) => {
  if (start >= textEnd || end <= textStart) {
    // Ignore, the token is not in the text
    return null;
  }

  // Shrink to this text boundaries
  start = Math.max(start, textStart);
  end = Math.min(end, textEnd);

  // Now shift offsets to be relative to this text
  start -= textStart;
  end -= textStart;

  return {
    anchorKey: text.key,
    anchorOffset: start,
    focusKey: text.key,
    focusOffset: end,
    marks: [{ type: "prism-token", data: { className } }],
  };
};

export const insertNewLineBeforeCodeBlock = change => {
  const anchor = change.value.anchorBlock;
  const codeBlock = change.value.document.getParent(anchor.key);

  if (codeBlock.type !== "code_block") return;

  // is it the first element in codeblock
  if (codeBlock.nodes.findIndex(node => node === anchor) !== 0) return;

  const parentContainer = change.value.document.getParent(codeBlock.key);
  const index = parentContainer.nodes.findIndex(node => node === codeBlock);

  change.insertNodeByKey(
    parentContainer.key,
    index,
    Block.create({
      type: "paragraph",
    }),
  );

  return true;
};

export const deleteNewLineBeforeCodeBlock = change => {
  const anchor = change.value.anchorBlock;
  const codeBlock = change.value.document.getParent(anchor.key);

  if (codeBlock.type !== "code_block") return;

  // is it the first element in codeblock
  if (codeBlock.nodes.findIndex(node => node === anchor) !== 0) return;

  const parentContainer = change.value.document.getParent(codeBlock.key);
  const index = parentContainer.nodes.findIndex(node => node === codeBlock);

  if (index === 0) {
    return applyCodeblock(change);

    // const targetNode = parentContainer.nodes.get(index);
    // change.removeNodeByKey(targetNode.key);
    // return true;
  }
};

export const preserveIndentationForCodeBlock = change => {
  const anchor = change.value.anchorBlock;
  const codeBlock = getCodeBlockParent(change.value);

  if (codeBlock.type !== "code_block") return;

  const lines = anchor.text.split(/\r?\n/);
  const lastLine = lines[lines.length - 1];
  let nSpaces = lastLine.search(/\S|$/);

  if (
    lastLine.trim().endsWith("{") ||
    lastLine.trim().endsWith("(") ||
    lastLine.trim().endsWith("[")
  ) {
    nSpaces += 2;
  }

  change.insertText("\n" + " ".repeat(nSpaces));

  return true;
};

export const unindentClosingBlocks = change => {
  const anchor = change.value.anchorBlock;
  const codeBlock = change.value.document.getParent(anchor.key);
  if (codeBlock.type !== "code_block") return;

  const lines = anchor.text.split(/\r?\n/);
  const lastLine = lines[lines.length - 1];

  const nSpaces = lastLine.search(/\S|$/);
  if (nSpaces === lastLine.length) {
    change.deleteBackward(2);
    return true;
  }
};

export const isPrintableKeycode = keycode => {
  return (
    (keycode > 47 && keycode < 58) || // number keys
    keycode == 32 ||
    keycode == 13 || // spacebar & return key(s) (if you want to allow carriage returns)
    (keycode > 64 && keycode < 91) || // letter keys
    (keycode > 95 && keycode < 112) || // numpad keys
    (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
    (keycode > 218 && keycode < 223)
  ); // [\]' (in order)
};

export const handleCommandAInCodeBlock = (event, change) => {
  if (!isMod(event)) return;

  const anchor = change.value.anchorBlock;
  const codeBlock = change.value.document.getParent(anchor.key);
  if (codeBlock.type !== "code_block") return;

  const startNode = codeBlock.nodes.get(0).nodes.get(0);
  const lastNode = codeBlock.nodes.get(codeBlock.nodes.size - 1).nodes.get(0);

  change.select(
    Range.create({
      anchorKey: startNode.key,
      anchorOffset: 0,
      focusKey: lastNode.key,
      focusOffset: codeBlock.text.length,
    }),
  );

  change.moveToRangeOf(codeBlock);
  change.focus();

  event.preventDefault();
  return true;
};
