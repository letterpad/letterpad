import UnderlineMark from "./UnderlineMark";
import UnderlineKeyboardShortcut from "./UnderlineKeyboardShortcut";
import * as UnderlineUtils from "./UnderlineUtils";
import UnderlineButton from "./UnderlineButton";

/* eslint-disable no-unused-vars */
const UnderlinePlugin = options => ({
  onKeyDown(...args) {
    return UnderlineKeyboardShortcut(...args);
  },
});

export {
  UnderlinePlugin,
  UnderlineMark,
  UnderlineKeyboardShortcut,
  UnderlineUtils,
  UnderlineButton,
};
