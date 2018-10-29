export const applyHeadings = (change, type) => change.setBlocks(type).focus();

/**
 * Check if the any of the currently selected blocks are of `type`.
 *
 * @param {String} type
 * @return {Boolean}
 */

export const hasBlock = (value, type) => {
  return value.blocks.some(node => node.type == type);
};
