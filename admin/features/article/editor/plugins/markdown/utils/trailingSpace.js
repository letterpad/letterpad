export default (change, currentTextNode, offsetIndex) =>
  change.insertTextByKey(currentTextNode.key, offsetIndex, "");
