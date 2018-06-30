import {
    unorderedListStrategy,
    orderedListStrategy,
    increaseListDepthStrategy,
    decreaseListDepthStrategy
} from "./ListUtils";

const ListKeyboardShortcut = (event, change) => {
    //
    // Behaviour to increase or decrease depth of the list.
    //
    if (event.key === "Tab") {
        event.preventDefault();
        if (event.shiftKey) return decreaseListDepthStrategy(change);
        return increaseListDepthStrategy(change);
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
