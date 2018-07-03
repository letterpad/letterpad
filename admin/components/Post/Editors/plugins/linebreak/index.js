import LinebreakNode from "./LinebreakNode";
import LinebreakKeyboardShortcut from "./LinebreakKeyboardShortcut";
import LinebreakButton from "./LinebreakButton";

import * as LinebreakUtils from "./LinebreakUtils";

/* eslint-disable no-unused-vars */
const LinebreakPlugin = options => ({
    onKeyDown(...args) {
        return LinebreakKeyboardShortcut(...args);
    }
});

export {
    LinebreakPlugin,
    LinebreakNode,
    LinebreakKeyboardShortcut,
    LinebreakUtils,
    LinebreakButton
};
