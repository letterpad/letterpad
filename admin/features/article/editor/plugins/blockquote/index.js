import BlockquoteNode from "./BlockquoteNode";
import BlockquoteKeyboardShortcut from "./BlockquoteKeyboardShortcut";
import * as BlockquoteUtils from "./BlockquoteUtils";
import BlockquoteButton from "./BlockquoteButton";

/* eslint-disable no-unused-vars */
const BlockquotePlugin = options => ({
    onKeyDown(...args) {
        return BlockquoteKeyboardShortcut(...args);
    }
});

export {
    BlockquotePlugin,
    BlockquoteNode,
    BlockquoteKeyboardShortcut,
    BlockquoteUtils,
    BlockquoteButton
};
