import { Mark, Range } from "slate";

import removeAllMark from "../utils/mark-removal";
import trailingSpace from "../utils/trailingSpace";

export default (type, currentTextNode, matched, change) => {
  const matchedLength = matched[0].length;
  const addText = matched[0].trim().replace(new RegExp(matched[1], "g"), "");
  return change
    .deleteAtRange(
      Range.create({
        anchorKey: currentTextNode.key,
        anchorOffset: matched.index,
        focusKey: currentTextNode.key,
        focusOffset: matched.index + matchedLength,
        isBackward: false,
      }),
    )
    .insertTextByKey(currentTextNode.key, matched.index, addText, [
      Mark.create({ type }),
    ])
    .call(trailingSpace, currentTextNode, matched.index)
    .call(removeAllMark);
};
