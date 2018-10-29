export default (type, currentTextNode, change) => {
  return change
    .removeNodeByKey(currentTextNode.key)
    .insertBlock({
      type,
      isVoid: true,
    })
    .collapseToStartOfNextBlock();
};
