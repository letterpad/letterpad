import { onSpace } from "./MarkdownUtils";
import { onBackspace, onEnter } from "../list/ListUtils";

const MarkdownKeyboardShortcut = (event, change) => {
    switch (event.key) {
        case " ":
            return onSpace(event, change);
        case "Backspace":
            return onBackspace(event, change);
        case "Enter": {
            return onEnter(event, change);
        }
    }

    return;
};

export default MarkdownKeyboardShortcut;
