/* eslint-disable react/prop-types */
import { italicMarkStrategy } from "./ItalicUtils";
import { isMod } from "../../helper/keyboard-event";

const ItalicKeyboardShortcut = (event, change) => {
    if (isMod(event) && event.key === "i") return italicMarkStrategy(change);
    return;
};

export default ItalicKeyboardShortcut;
