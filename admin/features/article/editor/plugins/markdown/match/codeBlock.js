import { Range, Data } from "slate";
import PluginEditCode from "slate-edit-code";

export default (codeOption, currentTextNode, matched, change, lang) => {
  const matchedLength = matched[0].length;
  const codePlugin = PluginEditCode(codeOption);
  let newChange = change;

  if (lang) {
    newChange = change.setBlocks({ data: Data.create({ syntax: lang }) });
  }

  return codePlugin.changes.wrapCodeBlock(
    newChange.deleteAtRange(
      Range.create({
        anchorKey: currentTextNode.key,
        focusKey: currentTextNode.key,
        anchorOffset: matched.index,
        focusOffset: matched.index + matchedLength,
      }),
    ),
  );
};
