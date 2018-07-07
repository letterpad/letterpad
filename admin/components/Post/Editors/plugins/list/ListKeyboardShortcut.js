import {
    unorderedListStrategy,
    orderedListStrategy,
    increaseListDepthStrategy,
    decreaseListDepthStrategy
} from "./ListUtils";

export const onBackspace = (event, change) => {
    const { value } = change;
    if (value.isExpanded) return;
    if (value.startOffset != 0) return;

    const { startBlock } = value;
    if (startBlock.type == "paragraph") return;

    event.preventDefault();
    change.setBlocks("paragraph");

    if (startBlock.type == "list-item") {
        change.unwrapBlock("ordered-list");
    }

    return true;
};

const ListKeyboardShortcut = (event, change) => {
    //
    // Behaviour to increase or decrease depth of the list.
    //
    if (event.key === "Tab") {
        event.preventDefault();
        if (event.shiftKey) return decreaseListDepthStrategy(change);
        return increaseListDepthStrategy(change);
    } else if (event.key === "Enter" || event.key === "Backspace") {
        const { value } = change;
        if (value.isExpanded) return;

        const { startBlock, startOffset } = value;
        if (startOffset == 0 && startBlock.text.length == 0) {
            return onBackspace(event, change);
        }
    }

    const unorderedKey = event.key === "l";
    const macUnordered = event.ctrlKey && event.shiftKey && unorderedKey;
    const winUnordered = event.altKey && event.shiftKey && unorderedKey;
    const isUnordered = macUnordered || winUnordered;
    if (isUnordered) return unorderedListStrategy(change);

    const orderedKey = event.key === "n";
    const macOrdered = event.ctrlKey && event.shiftKey && orderedKey;
    const winOrdered = event.altKey && event.shiftKey && orderedKey;
    const isOrdered = macOrdered || winOrdered;
    if (isOrdered) return orderedListStrategy(change);

    return;
};

export default ListKeyboardShortcut;
