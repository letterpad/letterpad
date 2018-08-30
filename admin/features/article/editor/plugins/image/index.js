import ImageNode from "./ImageNode";
import ImageKeyboardShortcut from "./ImageKeyboardShortcut";
import * as ImageUtils from "./ImageUtils";
import ImageButton from "./ImageButton";

/* eslint-disable no-unused-vars */
const ImagePlugin = options => ({
    onKeyDown(...args) {
        return ImageKeyboardShortcut(...args);
    }
});

export {
    ImagePlugin,
    ImageNode,
    ImageKeyboardShortcut,
    ImageUtils,
    ImageButton
};
