import HighlightMark from "./HighlightMark";
import HighlightKeyboardShortcut from "./HighlightKeyboardShortcut";
import * as HighlightUtils from "./HighlightUtils";
import HighlightButton from "./HighlightButton";

/* eslint-disable no-unused-vars */
const HighlightPlugin = options => ({
  onKeyDown(...args) {
    return HighlightKeyboardShortcut(...args);
  },
});

export {
  HighlightPlugin,
  HighlightMark,
  HighlightKeyboardShortcut,
  HighlightUtils,
  HighlightButton,
};
