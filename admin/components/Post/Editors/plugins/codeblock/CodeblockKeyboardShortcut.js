import {
    insertNewLineBeforeCodeBlock,
    deleteNewLineBeforeCodeBlock,
    isPrintableKeycode,
    preserveIndentationForCodeBlock,
    unindentClosingBlocks,
    handleCommandAInCodeBlock
} from "./CodeblockUtils";
import { isMod } from "../../helper/keyboard-event";

export const hasParentOfType = (value, type) =>
    value.blocks.some(
        block =>
            !!value.document.getClosest(
                block.key,
                parent => parent.type === type
            )
    );

/* eslint-disable react/prop-types */
const codeblockKeyboardShortcut = (event, change) => {
    const { value } = change;

    if (value.isExpanded && !isMod(event) && isPrintableKeycode(event.which)) {
        change.delete();
    }
    if (!hasParentOfType(value, "code_block")) return;
    switch (event.key) {
        case "Enter":
            if (value.startOffset === 0) {
                const done = insertNewLineBeforeCodeBlock(change);
                if (done) return true;
            }
            return preserveIndentationForCodeBlock(change);

        case "Backspace":
            if (value.startOffset === 0) {
                return deleteNewLineBeforeCodeBlock(change);
            }
            break;

        case "Tab":
            event.preventDefault();
            // insert 2 spaces
            change.insertText("  ");
            return true;

        case "a":
            return handleCommandAInCodeBlock(event, change);

        case "}":
        case ")":
        case "]":
            return unindentClosingBlocks(change);

        default:
        // console.log(event.key);
    }
};

export default codeblockKeyboardShortcut;
