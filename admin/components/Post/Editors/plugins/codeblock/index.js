import CodeblockNode from "./CodeblockNode";
import CodeblockKeyboardShortcut from "./CodeblockKeyboardShortcut";
import * as CodeblockUtils from "./CodeblockUtils";
import CodeblockButton from "./CodeblockButton";

/* eslint-disable no-unused-vars */
const CodeblockPlugin = options => ({
    onKeyDown({ change }) {
        const { value } = change;
        const { startBlock } = value;
        if (event.key != "Enter") return;
        if (startBlock.type != "code") return;
        if (value.isExpanded) change.delete();
        change.insertText("\n");
        return true;

        // return CodeblockKeyboardShortcut(...args);
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
