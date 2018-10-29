/* eslint-disable react/prop-types */
import { underlineMarkStrategy } from "./UnderlineUtils";
import { isMod } from "../../helper/keyboard-event";

const UnderlineKeyboardShortcut = (event, change) => {
  if (isMod(event) && event.key === "i") return underlineMarkStrategy(change);
  return;
};

export default UnderlineKeyboardShortcut;
