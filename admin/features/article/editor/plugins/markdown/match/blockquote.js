import { Range } from "slate";

export default (type, currentTextNode, matched, change) => {
  const matchedLength = matched[0].length;
  return change.setBlocks(type).deleteAtRange(
    Range.create({
      anchorKey: currentTextNode.key,
      focusKey: currentTextNode.key,
      anchorOffset: matched.index,
      focusOffset: matched.index + matchedLength,
    }),
  );
};
