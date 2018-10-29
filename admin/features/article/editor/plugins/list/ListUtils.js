export const getBlockParent = (value, type) => {
  let parentNode = value.anchorBlock;
  do {
    if (parentNode.type === type) {
      return parentNode;
    }
  } while ((parentNode = value.document.getParent(parentNode.key)));
  return null;
};

export const onTab = (event, change) => {
  event.preventDefault();
  if (event.shiftKey) return decreaseListDepthStrategy(change);
  return increaseListDepthStrategy(change);
};

export const onBackspace = (event, change) => {
  const { value } = change;
  if (value.isExpanded) return;
  if (value.startOffset != 0) return;

  const { startBlock } = value;
  if (startBlock.type == "paragraph") return;

  event.preventDefault();

  if (value.startOffset === 0) {
    const node = getNodeOfType(value, "list-item");
    if (!node) return;
    const depth = value.document.getDepth(node.key);
    if (depth > 2) {
      return decreaseListDepthStrategy(change);
    }
  }

  if (startBlock.type == "list-item") {
    change.setBlocks("paragraph");
    if (getBlockParent(value, "unordered-list")) {
      change.unwrapBlock("unordered-list");
    } else if (getBlockParent(value, "ordered-list")) {
      change.unwrapBlock("ordered-list");
    }
    return true;
  }
};

export const onEnter = (event, change) => {
  const { value } = change;
  if (value.isExpanded) return;

  const { startBlock, startOffset, endOffset } = value;
  if (startOffset == 0 && startBlock.text.length == 0)
    return onBackspace(event, change);
  if (endOffset != startBlock.text.length) return;

  if (
    startBlock.type != "heading-one" &&
    startBlock.type != "heading-two" &&
    startBlock.type != "heading-three" &&
    startBlock.type != "heading-four" &&
    startBlock.type != "heading-five" &&
    startBlock.type != "heading-six" &&
    startBlock.type != "block-quote"
  ) {
    return;
  }

  event.preventDefault();

  change.splitBlock().setBlocks("paragraph");
  return true;
};

//....................... refactor belows

export const isList = value =>
  value.blocks.some(block => block.type === "list-item");

export const hasParentOfType = (value, type) =>
  value.blocks.some(
    block =>
      !!value.document.getClosest(block.key, parent => parent.type === type),
  );
export const isUnorderedList = value =>
  hasParentOfType(value, "unordered-list");
export const isOrderedList = value => hasParentOfType(value, "ordered-list");

export const getNodeOfType = (value, type) =>
  value.blocks.filter(block => block.type === type).first();
export const getUnorderedListNode = value =>
  getNodeOfType(value, "unordered-list");
export const getOrderedListNode = value => getNodeOfType(value, "ordered-list");

export const removeUnorderedList = change =>
  change
    .setBlocks("paragraph")
    .unwrapBlock("unordered-list")
    .focus();

export const switchToOrderedList = change =>
  change
    .unwrapBlock("unordered-list")
    .wrapBlock("ordered-list")
    .focus();

export const removeOrderedList = change =>
  change
    .setBlocks("paragraph")
    .unwrapBlock("ordered-list")
    .focus();

export const switchToUnorderedList = change =>
  change
    .wrapBlock("unordered-list")
    .unwrapBlock("ordered-list")
    .focus();

export const applyList = (change, type) =>
  change
    .setBlocks("list-item")
    .wrapBlock(type)
    .focus();

export const onlyRemove = (change, type) => change.unwrapBlock(type).focus();
export const onlyRemoveUnorderedList = change =>
  onlyRemove(change, "unordered-list");
export const onlyRemoveOrderedList = change =>
  onlyRemove(change, "ordered-list");

export const applyUnorderedList = change => applyList(change, "unordered-list");
export const applyOrderedList = change => applyList(change, "ordered-list");

const deepRemoveList = change => {
  const { value } = change;
  const { document } = value;
  const node = getNodeOfType(value, "list-item");
  const depth = document.getDepth(node.key);

  Array(depth)
    .fill(".")
    .forEach(() => {
      const parent = document.getParent(node.key);
      if (parent.type === "unordered-list") removeUnorderedList(change);
      else removeOrderedList(change);
    });
  return change;
};

export const unorderedListStrategy = change => {
  const { value } = change;
  if (!isList(value)) return applyList(change, "unordered-list");

  if (isUnorderedList(value)) return deepRemoveList(change);
  if (isOrderedList(value)) return switchToUnorderedList(change);
  console.info("[SlateJS][ListPlugin] It is a different type of list.");
  return change;
};

export const orderedListStrategy = change => {
  const { value } = change;
  // If it is not a list yet, transform it!
  if (!isList(value)) return applyList(change, "ordered-list");

  // If it is already a list, handle it!
  if (isOrderedList(value)) return deepRemoveList(change);
  else if (isUnorderedList(value)) return switchToOrderedList(change);
  else console.info("[SlateJS][ListPlugin] It is a different type of list.");
  return change;
};

export const increaseListDepthStrategy = change => {
  const { value } = change;
  // If it is not a list, kill the action immediately.
  if (!isList(value)) return change;

  if (isUnorderedList(value)) return applyUnorderedList(change);
  if (isOrderedList(value)) return applyOrderedList(change);
  return change;
};

export const decreaseListDepthStrategy = change => {
  const { value } = change;
  // If it is not a list, kill the action immediately.
  if (!isList(value)) return change;

  const node = getNodeOfType(value, "list-item");
  const depth = value.document.getDepth(node.key);
  if (isUnorderedList(value) && depth > 2)
    return onlyRemoveUnorderedList(change);
  if (isOrderedList(value) && depth > 2) return onlyRemoveOrderedList(change);
  return change;
};
