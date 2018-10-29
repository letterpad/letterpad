import BoldMark from "./BoldMark";
import BoldKeyboardShortcut from "./BoldKeyboardShortcut";
import * as BoldUtils from "./BoldUtils";
import BoldButton from "./BoldButton";

/* eslint-disable no-unused-vars */
const BoldPlugin = options => ({
  onKeyDown(...args) {
    return BoldKeyboardShortcut(...args);
  },
});

export { BoldPlugin, BoldMark, BoldKeyboardShortcut, BoldUtils, BoldButton };
