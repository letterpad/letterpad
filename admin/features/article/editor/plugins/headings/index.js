import HeadingsNode from "./HeadingsNode";
import HeadingsKeyboardShortcut from "./HeadingsKeyboardShortcut";
import * as HeadingsUtils from "./HeadingsUtils";
import HeadingsButton from "./HeadingsButton";
/* eslint-disable no-unused-vars */
const HeadingsPlugin = options => ({
  onKeyDown(...args) {
    return HeadingsKeyboardShortcut(...args);
  },
});

export {
  HeadingsPlugin,
  HeadingsNode,
  HeadingsKeyboardShortcut,
  HeadingsUtils,
  HeadingsButton,
};
