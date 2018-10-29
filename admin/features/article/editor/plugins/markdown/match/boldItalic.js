import { Mark, Range } from "slate";
import trailingSpace from "../utils/trailingSpace";
import removeAllMark from "../utils/mark-removal";

export default (type, currentTextNode, matched, change) => {
  const matchedLength = matched[0].length;
  const reg = matched[1] === "***" ? /\*\*\*/ : matched[1];
  const addText = matched[0].trim().replace(new RegExp(reg, "g"), "");

  return change
    .deleteAtRange(
      Range.create({
        anchorKey: currentTextNode.key,
        focusKey: currentTextNode.key,
        anchorOffset: matched.index,
        focusOffset: matched.index + matchedLength,
      }),
    )
    .insertTextByKey(currentTextNode.key, matched.index, addText, [
      Mark.create({ type: "bold" }),
      Mark.create({ type: "italic" }),
    ])
    .call(trailingSpace, currentTextNode, matched.index)
    .call(removeAllMark);
};
