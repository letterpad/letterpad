import ItalicMark from "./ItalicMark";
import ItalicKeyboardShortcut from "./ItalicKeyboardShortcut";
import * as ItalicUtils from "./ItalicUtils";
import ItalicButton from "./ItalicButton";

/* eslint-disable no-unused-vars */
const ItalicPlugin = options => ({
  onKeyDown(...args) {
    return ItalicKeyboardShortcut(...args);
  },
});

export {
  ItalicPlugin,
  ItalicMark,
  ItalicKeyboardShortcut,
  ItalicUtils,
  ItalicButton,
};
