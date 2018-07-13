import CodeblockNode from "./CodeblockNode";
import CodeblockKeyboardShortcut from "./CodeblockKeyboardShortcut";
import * as CodeblockUtils from "./CodeblockUtils";
import CodeblockButton from "./CodeblockButton";

/* eslint-disable no-unused-vars */
const CodeblockPlugin = options => ({
    onKeyDown(...args) {
        return CodeblockKeyboardShortcut(...args);
    },
    decorateNode(node) {
        return CodeblockUtils.decorateNode(node);
    }
});

export {
    CodeblockPlugin,
    CodeblockNode,
    CodeblockKeyboardShortcut,
    CodeblockUtils,
    CodeblockButton
};
