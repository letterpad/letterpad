import { onTab, onBackspace, onEnter } from "./ListUtils";

const ListKeyboardShortcut = (event, change) => {
    switch (event.key) {
        case "Tab":
            return onTab(event, change);
        case "Backspace":
            return onBackspace(event, change);
        case "Enter": {
            return onEnter(event, change);
        }
    }

    return;
};

export default ListKeyboardShortcut;
